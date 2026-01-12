-- Create Emergency Room Module Tables

-- ER Patients table for emergency room visits
CREATE TABLE public.er_patients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES public.patients(id),
    er_number TEXT NOT NULL UNIQUE,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    arrival_method TEXT NOT NULL DEFAULT 'walk_in', -- walk_in, ambulance, transfer
    chief_complaint TEXT NOT NULL,
    triage_level INTEGER NOT NULL DEFAULT 5, -- 1=Critical, 2=Urgent, 3=Less Urgent, 4=Non-urgent, 5=Unassigned
    triage_notes TEXT,
    assigned_doctor_id TEXT,
    assigned_nurse_id TEXT,
    bed_number TEXT,
    status TEXT NOT NULL DEFAULT 'waiting', -- waiting, in_treatment, discharged, admitted, transferred, deceased
    priority_score INTEGER DEFAULT 0,
    estimated_wait_time INTEGER, -- in minutes
    treatment_start_time TIMESTAMP WITH TIME ZONE,
    discharge_time TIMESTAMP WITH TIME ZONE,
    disposition TEXT, -- home, admitted, transferred, deceased, ama
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ER Beds table for bed management
CREATE TABLE public.er_beds (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bed_number TEXT NOT NULL UNIQUE,
    bed_type TEXT NOT NULL, -- trauma, isolation, general, pediatric
    zone TEXT NOT NULL, -- red_zone, yellow_zone, green_zone, pediatric
    status TEXT NOT NULL DEFAULT 'available', -- available, occupied, maintenance, cleaning
    current_patient_id UUID REFERENCES public.er_patients(id),
    location_description TEXT,
    equipment TEXT[], -- array of available equipment
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Triage assessments
CREATE TABLE public.er_triage (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    er_patient_id UUID NOT NULL REFERENCES public.er_patients(id),
    triaged_by TEXT NOT NULL,
    triage_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    chief_complaint TEXT NOT NULL,
    vital_signs JSONB, -- {temperature, blood_pressure, heart_rate, respiratory_rate, oxygen_saturation, pain_scale}
    triage_level INTEGER NOT NULL, -- 1-5 scale
    priority_modifiers TEXT[], -- allergies, pregnancy, mental_health, etc
    initial_assessment TEXT,
    recommended_actions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vital Signs monitoring
CREATE TABLE public.er_vital_signs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    er_patient_id UUID NOT NULL REFERENCES public.er_patients(id),
    recorded_by TEXT NOT NULL,
    recorded_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    temperature DECIMAL(4,1), -- Celsius
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER,
    pain_scale INTEGER, -- 0-10
    consciousness_level TEXT, -- alert, confused, unconscious
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Emergency orders (lab, radiology, medications)
CREATE TABLE public.er_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    er_patient_id UUID NOT NULL REFERENCES public.er_patients(id),
    order_type TEXT NOT NULL, -- lab, radiology, medication, procedure
    order_category TEXT, -- blood_work, xray, ct, mri, ultrasound, etc
    order_details TEXT NOT NULL,
    urgency TEXT NOT NULL DEFAULT 'routine', -- stat, urgent, routine
    ordered_by TEXT NOT NULL,
    ordered_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, cancelled
    results TEXT,
    completed_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ambulance tracking
CREATE TABLE public.ambulance_dispatch (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    dispatch_number TEXT NOT NULL UNIQUE,
    ambulance_id TEXT NOT NULL,
    dispatch_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    pickup_location TEXT NOT NULL,
    patient_name TEXT,
    patient_age INTEGER,
    chief_complaint TEXT,
    priority_level INTEGER, -- 1-3 (1=Critical, 2=Urgent, 3=Non-urgent)
    eta TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'dispatched', -- dispatched, en_route, arrived, completed
    crew_members TEXT[],
    equipment_used TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Emergency team alerts
CREATE TABLE public.er_alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type TEXT NOT NULL, -- code_blue, code_red, trauma_activation, mass_casualty
    er_patient_id UUID REFERENCES public.er_patients(id),
    triggered_by TEXT NOT NULL,
    triggered_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    severity TEXT NOT NULL, -- critical, high, medium, low
    description TEXT NOT NULL,
    location TEXT, -- bed number or area
    team_members_notified TEXT[],
    status TEXT NOT NULL DEFAULT 'active', -- active, acknowledged, resolved
    resolved_time TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ER Statistics and reporting
CREATE TABLE public.er_statistics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_patients INTEGER DEFAULT 0,
    average_wait_time INTEGER, -- in minutes
    average_length_of_stay INTEGER, -- in minutes
    patients_by_triage JSONB, -- {level_1: count, level_2: count, etc}
    common_complaints JSONB, -- {complaint: count}
    bed_occupancy_rate DECIMAL(5,2), -- percentage
    left_without_being_seen INTEGER DEFAULT 0,
    admissions INTEGER DEFAULT 0,
    transfers INTEGER DEFAULT 0,
    discharges INTEGER DEFAULT 0,
    mortality_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(report_date)
);

-- Enable Row Level Security
ALTER TABLE public.er_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_triage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_dispatch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.er_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for ER tables (allowing all operations for now)
CREATE POLICY "Allow all operations on er_patients" ON public.er_patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on er_beds" ON public.er_beds FOR ALL USING (true);
CREATE POLICY "Allow all operations on er_triage" ON public.er_triage FOR ALL USING (true);
CREATE POLICY "Allow all operations on er_vital_signs" ON public.er_vital_signs FOR ALL USING (true);
CREATE POLICY "Allow all operations on er_orders" ON public.er_orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on ambulance_dispatch" ON public.ambulance_dispatch FOR ALL USING (true);
CREATE POLICY "Allow all operations on er_alerts" ON public.er_alerts FOR ALL USING (true);
CREATE POLICY "Allow all operations on er_statistics" ON public.er_statistics FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_er_patients_status ON public.er_patients(status);
CREATE INDEX idx_er_patients_triage_level ON public.er_patients(triage_level);
CREATE INDEX idx_er_patients_arrival_time ON public.er_patients(arrival_time);
CREATE INDEX idx_er_patients_patient_id ON public.er_patients(patient_id);
CREATE INDEX idx_er_beds_status ON public.er_beds(status);
CREATE INDEX idx_er_beds_zone ON public.er_beds(zone);
CREATE INDEX idx_er_orders_status ON public.er_orders(status);
CREATE INDEX idx_er_orders_urgency ON public.er_orders(urgency);
CREATE INDEX idx_er_alerts_status ON public.er_alerts(status);
CREATE INDEX idx_ambulance_dispatch_status ON public.ambulance_dispatch(status);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_er_patients_updated_at BEFORE UPDATE ON public.er_patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_er_beds_updated_at BEFORE UPDATE ON public.er_beds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_er_orders_updated_at BEFORE UPDATE ON public.er_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ambulance_dispatch_updated_at BEFORE UPDATE ON public.ambulance_dispatch FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_er_alerts_updated_at BEFORE UPDATE ON public.er_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_er_statistics_updated_at BEFORE UPDATE ON public.er_statistics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample ER beds
INSERT INTO public.er_beds (bed_number, bed_type, zone, location_description, equipment) VALUES
('ER-T1', 'trauma', 'red_zone', 'Trauma Bay 1', ARRAY['ventilator', 'defibrillator', 'ultrasound']),
('ER-T2', 'trauma', 'red_zone', 'Trauma Bay 2', ARRAY['ventilator', 'defibrillator', 'ultrasound']),
('ER-G1', 'general', 'yellow_zone', 'General Bed 1', ARRAY['monitor', 'oxygen']),
('ER-G2', 'general', 'yellow_zone', 'General Bed 2', ARRAY['monitor', 'oxygen']),
('ER-G3', 'general', 'yellow_zone', 'General Bed 3', ARRAY['monitor', 'oxygen']),
('ER-G4', 'general', 'green_zone', 'General Bed 4', ARRAY['monitor']),
('ER-G5', 'general', 'green_zone', 'General Bed 5', ARRAY['monitor']),
('ER-ISO1', 'isolation', 'red_zone', 'Isolation Room 1', ARRAY['ventilator', 'monitor', 'oxygen']),
('ER-PED1', 'pediatric', 'pediatric', 'Pediatric Bed 1', ARRAY['pediatric_monitor', 'oxygen']);