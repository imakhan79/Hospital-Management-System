import { supabase } from "@/integrations/supabase/client";

export interface HIPAAAuditLog {
  id: string;
  user_id: string;
  user_email: string;
  user_role: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  patient_id?: string;
  phi_accessed: boolean;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  timestamp: string;
  details?: any;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export type UserRole = 'super_admin' | 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'lab_technician' | 'radiologist' | 'billing_staff' | 'patient' | 'receptionist';

export type Permission = 'read_all_patients' | 'write_all_patients' | 'read_own_patients' | 'write_own_patients' | 'manage_appointments' | 'manage_billing' | 'manage_pharmacy' | 'manage_lab_results' | 'manage_radiology' | 'view_reports' | 'manage_users' | 'audit_access';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  department?: string;
  license_number?: string;
  phone?: string;
  is_active: boolean;
  last_login?: string;
  mfa_enabled: boolean;
  session_timeout_minutes: number;
  allowed_ip_ranges?: string[];
}

export interface PatientConsent {
  id: string;
  patient_id: string;
  consent_type: 'treatment' | 'data_sharing' | 'research' | 'marketing' | 'third_party_access';
  granted: boolean;
  granted_at?: string;
  expires_at?: string;
  granted_by?: string;
  witness?: string;
  digital_signature?: string;
}

export interface DataAccessRequest {
  id: string;
  patient_id: string;
  request_type: 'view' | 'download' | 'correct' | 'delete' | 'restrict';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requested_at: string;
  processed_at?: string;
  processed_by?: string;
  response_due_date: string;
  notes?: string;
  fulfillment_method?: 'portal' | 'email' | 'mail' | 'pickup';
}

export class HIPAAService {
  // Audit logging
  static async logAudit(params: {
    action: string;
    resource_type: string;
    resource_id?: string;
    patient_id?: string;
    phi_accessed?: boolean;
    details?: any;
  }) {
    try {
      const { data, error } = await supabase.rpc('log_hipaa_audit', {
        p_action: params.action,
        p_resource_type: params.resource_type,
        p_resource_id: params.resource_id || null,
        p_patient_id: params.patient_id || null,
        p_phi_accessed: params.phi_accessed || false,
        p_details: params.details || null
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging HIPAA audit:', error);
      throw error;
    }
  }

  // Get audit logs
  static async getAuditLogs(filters?: {
    user_id?: string;
    patient_id?: string;
    resource_type?: string;
    start_date?: string;
    end_date?: string;
    phi_only?: boolean;
  }) {
    try {
      let query = supabase
        .from('hipaa_audit_log')
        .select('*')
        .order('timestamp', { ascending: false });

      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters?.patient_id) {
        query = query.eq('patient_id', filters.patient_id);
      }
      if (filters?.resource_type) {
        query = query.eq('resource_type', filters.resource_type);
      }
      if (filters?.start_date) {
        query = query.gte('timestamp', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('timestamp', filters.end_date);
      }
      if (filters?.phi_only) {
        query = query.eq('phi_accessed', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as HIPAAAuditLog[];
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  // User profile management
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log the update
      await this.logAudit({
        action: 'UPDATE',
        resource_type: 'user_profiles',
        resource_id: data.id,
        details: updates
      });

      return data as UserProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Permission checking
  static async checkPermission(permission: Permission) {
    try {
      const { data, error } = await supabase.rpc('user_has_permission', {
        p_permission: permission
      });

      if (error) throw error;
      return data as boolean;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  // Patient consent management
  static async getPatientConsent(patientId: string) {
    try {
      const { data, error } = await supabase
        .from('patient_consent')
        .select('*')
        .eq('patient_id', patientId);

      if (error) throw error;
      return data as PatientConsent[];
    } catch (error) {
      console.error('Error fetching patient consent:', error);
      throw error;
    }
  }

  static async updatePatientConsent(consentId: string, updates: Partial<PatientConsent>) {
    try {
      const { data, error } = await supabase
        .from('patient_consent')
        .update(updates)
        .eq('id', consentId)
        .select()
        .single();

      if (error) throw error;

      // Log the consent change
      await this.logAudit({
        action: 'UPDATE',
        resource_type: 'patient_consent',
        resource_id: data.id,
        patient_id: data.patient_id,
        phi_accessed: true,
        details: updates
      });

      return data as PatientConsent;
    } catch (error) {
      console.error('Error updating patient consent:', error);
      throw error;
    }
  }

  // Data access requests
  static async createDataAccessRequest(request: Omit<DataAccessRequest, 'id' | 'requested_at' | 'status' | 'response_due_date'>) {
    try {
      const { data, error } = await supabase
        .from('data_access_requests')
        .insert(request)
        .select()
        .single();

      if (error) throw error;

      // Log the request
      await this.logAudit({
        action: 'INSERT',
        resource_type: 'data_access_requests',
        resource_id: data.id,
        patient_id: data.patient_id,
        phi_accessed: true,
        details: request
      });

      return data as DataAccessRequest;
    } catch (error) {
      console.error('Error creating data access request:', error);
      throw error;
    }
  }

  static async getDataAccessRequests(patientId?: string) {
    try {
      let query = supabase
        .from('data_access_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DataAccessRequest[];
    } catch (error) {
      console.error('Error fetching data access requests:', error);
      throw error;
    }
  }

  // Session management
  static async validateSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      // Update last login time and check session timeout
      const profile = await this.getUserProfile(session.user.id);
      if (profile && profile.last_login) {
        const lastLogin = new Date(profile.last_login);
        const now = new Date();
        const sessionDuration = (now.getTime() - lastLogin.getTime()) / (1000 * 60); // minutes

        if (sessionDuration > profile.session_timeout_minutes) {
          await supabase.auth.signOut();
          return false;
        }

        // Update last activity
        await this.updateUserProfile(session.user.id, {
          last_login: now.toISOString()
        });
      }

      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  // Data encryption helpers
  static async encryptSensitiveData(data: string, patientId?: string): Promise<string> {
    // In production, this would use proper encryption libraries
    // For demo purposes, we'll use base64 encoding
    try {
      return btoa(data);
    } catch (error) {
      console.error('Error encrypting data:', error);
      return data;
    }
  }

  static async decryptSensitiveData(encryptedData: string, patientId?: string): Promise<string> {
    // In production, this would use proper decryption
    try {
      return atob(encryptedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return encryptedData;
    }
  }

  // Data anonymization
  static anonymizePatientData(data: any): any {
    const anonymized = { ...data };
    
    // Remove or mask PII fields
    if (anonymized.first_name) anonymized.first_name = 'REDACTED';
    if (anonymized.last_name) anonymized.last_name = 'REDACTED';
    if (anonymized.email) anonymized.email = 'REDACTED@REDACTED.com';
    if (anonymized.contact_number) anonymized.contact_number = 'XXX-XXX-XXXX';
    if (anonymized.address) anonymized.address = 'REDACTED';
    if (anonymized.emergency_contact) anonymized.emergency_contact = 'REDACTED';
    if (anonymized.emergency_contact_number) anonymized.emergency_contact_number = 'XXX-XXX-XXXX';
    
    return anonymized;
  }
}