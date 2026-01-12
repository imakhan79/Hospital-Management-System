-- Create HIPAA compliance and ICD-10 infrastructure

-- User roles and permissions for RBAC
CREATE TYPE public.user_role AS ENUM (
  'super_admin',
  'admin', 
  'doctor',
  'nurse',
  'pharmacist',
  'lab_technician',
  'radiologist',
  'billing_staff',
  'patient',
  'receptionist'
);

CREATE TYPE public.permission AS ENUM (
  'read_all_patients',
  'write_all_patients', 
  'read_own_patients',
  'write_own_patients',
  'manage_appointments',
  'manage_billing',
  'manage_pharmacy',
  'manage_lab_results',
  'manage_radiology',
  'view_reports',
  'manage_users',
  'audit_access'
);

-- User profiles with RBAC
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patient',
  department TEXT,
  license_number TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  password_last_changed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  mfa_secret TEXT,
  session_timeout_minutes INTEGER DEFAULT 30,
  allowed_ip_ranges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Role permissions mapping
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role user_role NOT NULL,
  permission permission NOT NULL,
  UNIQUE(role, permission)
);

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission) VALUES
  -- Super Admin - full access
  ('super_admin', 'read_all_patients'),
  ('super_admin', 'write_all_patients'),
  ('super_admin', 'manage_appointments'),
  ('super_admin', 'manage_billing'),
  ('super_admin', 'manage_pharmacy'),
  ('super_admin', 'manage_lab_results'),
  ('super_admin', 'manage_radiology'),
  ('super_admin', 'view_reports'),
  ('super_admin', 'manage_users'),
  ('super_admin', 'audit_access'),
  
  -- Doctor permissions
  ('doctor', 'read_all_patients'),
  ('doctor', 'write_all_patients'),
  ('doctor', 'manage_appointments'),
  ('doctor', 'manage_pharmacy'),
  ('doctor', 'manage_lab_results'),
  ('doctor', 'view_reports'),
  
  -- Nurse permissions
  ('nurse', 'read_own_patients'),
  ('nurse', 'write_own_patients'),
  ('nurse', 'manage_appointments'),
  
  -- Patient permissions
  ('patient', 'read_own_patients');

-- HIPAA Audit Trail
CREATE TABLE public.hipaa_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  user_email TEXT,
  user_role user_role,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  patient_id UUID,
  phi_accessed BOOLEAN NOT NULL DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  details JSONB,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical'))
);

-- ICD-10 Codes Database
CREATE TABLE public.icd10_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  code_type TEXT NOT NULL CHECK (code_type IN ('CM', 'PCS')), -- CM = Clinical Modification, PCS = Procedure Coding System
  is_billable BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  effective_date DATE,
  revision_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast ICD-10 code searches
CREATE INDEX idx_icd10_codes_code ON public.icd10_codes(code);
CREATE INDEX idx_icd10_codes_description ON public.icd10_codes USING gin(to_tsvector('english', description));
CREATE INDEX idx_icd10_codes_category ON public.icd10_codes(category);

-- Patient data encryption keys (for field-level encryption)
CREATE TABLE public.patient_encryption_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL UNIQUE,
  encryption_key TEXT NOT NULL, -- This would be encrypted with a master key in production
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rotated_at TIMESTAMP WITH TIME ZONE
);

-- Patient consent and data access rights
CREATE TABLE public.patient_consent (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('treatment', 'data_sharing', 'research', 'marketing', 'third_party_access')),
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  granted_by TEXT, -- Patient or legal guardian
  witness TEXT,
  digital_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data access requests (patients can request their data)
CREATE TABLE public.data_access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('view', 'download', 'correct', 'delete', 'restrict')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  response_due_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  notes TEXT,
  fulfillment_method TEXT CHECK (fulfillment_method IN ('portal', 'email', 'mail', 'pickup'))
);

-- Update existing tables to include ICD-10 and audit fields
ALTER TABLE public.medical_records 
ADD COLUMN icd10_diagnosis_codes TEXT[],
ADD COLUMN icd10_procedure_codes TEXT[],
ADD COLUMN created_by UUID,
ADD COLUMN last_modified_by UUID,
ADD COLUMN access_level TEXT DEFAULT 'standard' CHECK (access_level IN ('public', 'standard', 'restricted', 'confidential'));

ALTER TABLE public.patients 
ADD COLUMN data_sharing_consent BOOLEAN DEFAULT false,
ADD COLUMN last_accessed TIMESTAMP WITH TIME ZONE,
ADD COLUMN access_count INTEGER DEFAULT 0;

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hipaa_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icd10_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for HIPAA compliance
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id::text = auth.uid()::text 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Anyone can view role permissions" ON public.role_permissions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify role permissions" ON public.role_permissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id::text = auth.uid()::text 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Audit logs viewable by authorized users" ON public.hipaa_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id::text = auth.uid()::text 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "ICD-10 codes viewable by all authenticated users" ON public.icd10_codes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can modify ICD-10 codes" ON public.icd10_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id::text = auth.uid()::text 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Patients can view own consent records" ON public.patient_consent
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM public.patients 
      WHERE patient_id = (
        SELECT patient_id FROM public.user_profiles 
        WHERE user_id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Patients can view own data access requests" ON public.data_access_requests
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM public.patients 
      WHERE patient_id = (
        SELECT patient_id FROM public.user_profiles 
        WHERE user_id::text = auth.uid()::text
      )
    )
  );

-- Functions for HIPAA compliance
CREATE OR REPLACE FUNCTION public.log_hipaa_audit(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_patient_id UUID DEFAULT NULL,
  p_phi_accessed BOOLEAN DEFAULT false,
  p_details JSONB DEFAULT NULL
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id UUID;
  user_profile RECORD;
BEGIN
  -- Get user profile
  SELECT * INTO user_profile 
  FROM public.user_profiles 
  WHERE user_id::text = auth.uid()::text;
  
  -- Insert audit log
  INSERT INTO public.hipaa_audit_log (
    user_id,
    user_email,
    user_role,
    action,
    resource_type,
    resource_id,
    patient_id,
    phi_accessed,
    ip_address,
    session_id,
    details
  ) VALUES (
    auth.uid(),
    user_profile.email,
    user_profile.role,
    p_action,
    p_resource_type,
    p_resource_id,
    p_patient_id,
    p_phi_accessed,
    inet_client_addr(),
    current_setting('app.session_id', true),
    p_details
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Function to check user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(p_permission permission)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role_val user_role;
BEGIN
  -- Get user role
  SELECT role INTO user_role_val
  FROM public.user_profiles
  WHERE user_id::text = auth.uid()::text;
  
  -- Check if role has permission
  RETURN EXISTS (
    SELECT 1 FROM public.role_permissions
    WHERE role = user_role_val AND permission = p_permission
  );
END;
$$;

-- Function to search ICD-10 codes
CREATE OR REPLACE FUNCTION public.search_icd10_codes(
  p_search_term TEXT,
  p_code_type TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  code TEXT,
  description TEXT,
  category TEXT,
  code_type TEXT,
  is_billable BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.code,
    i.description,
    i.category,
    i.code_type,
    i.is_billable
  FROM public.icd10_codes i
  WHERE 
    i.is_active = true
    AND (
      i.code ILIKE '%' || p_search_term || '%'
      OR i.description ILIKE '%' || p_search_term || '%'
      OR to_tsvector('english', i.description) @@ plainto_tsquery('english', p_search_term)
    )
    AND (p_code_type IS NULL OR i.code_type = p_code_type)
  ORDER BY 
    CASE 
      WHEN i.code ILIKE p_search_term || '%' THEN 1
      WHEN i.code ILIKE '%' || p_search_term || '%' THEN 2
      WHEN i.description ILIKE p_search_term || '%' THEN 3
      ELSE 4
    END,
    i.code
  LIMIT p_limit;
END;
$$;

-- Triggers for audit logging
CREATE OR REPLACE FUNCTION public.trigger_hipaa_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the operation
  PERFORM public.log_hipaa_audit(
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_TABLE_NAME = 'patients' THEN COALESCE(NEW.id, OLD.id)
      WHEN TG_TABLE_NAME = 'medical_records' THEN COALESCE(NEW.patient_id, OLD.patient_id)
      ELSE NULL
    END,
    true, -- PHI accessed
    row_to_json(COALESCE(NEW, OLD))
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Apply audit triggers to tables with PHI
CREATE TRIGGER patients_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.trigger_hipaa_audit();

CREATE TRIGGER medical_records_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.medical_records
  FOR EACH ROW EXECUTE FUNCTION public.trigger_hipaa_audit();

-- Update triggers for timestamp management
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_icd10_codes_updated_at
  BEFORE UPDATE ON public.icd10_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_consent_updated_at
  BEFORE UPDATE ON public.patient_consent
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sample ICD-10 codes for testing
INSERT INTO public.icd10_codes (code, description, category, code_type) VALUES
  ('Z00.00', 'Encounter for general adult medical examination without abnormal findings', 'Health Services', 'CM'),
  ('Z00.01', 'Encounter for general adult medical examination with abnormal findings', 'Health Services', 'CM'),
  ('I10', 'Essential hypertension', 'Cardiovascular', 'CM'),
  ('E11.9', 'Type 2 diabetes mellitus without complications', 'Endocrine', 'CM'),
  ('J44.1', 'Chronic obstructive pulmonary disease with acute exacerbation', 'Respiratory', 'CM'),
  ('M25.561', 'Pain in right knee', 'Musculoskeletal', 'CM'),
  ('R06.02', 'Shortness of breath', 'Symptoms', 'CM'),
  ('Z51.11', 'Encounter for antineoplastic chemotherapy', 'Health Services', 'CM'),
  ('0016070', 'Bypass Coronary Artery, One Artery from Coronary Artery with Zooplastic Tissue, Open Approach', 'Cardiovascular', 'PCS'),
  ('0JH60XZ', 'Insertion of Pacemaker into Chest Subcutaneous Tissue and Fascia, Open Approach', 'Cardiovascular', 'PCS');