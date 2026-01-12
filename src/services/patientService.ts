
import { supabase } from "@/integrations/supabase/client";

export interface Patient {
  id: string;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  contact_number: string | null;
  email: string | null;
  address: string | null;
  registration_date: string;
  status: string;
  blood_type: string | null;
  emergency_contact: string | null;
  emergency_contact_number: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) {
    console.error('Error fetching patients:', error);
    throw new Error('Failed to fetch patients');
  }

  return data || [];
}

export async function fetchPatientById(id: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching patient:', error);
    return null;
  }

  return data;
}
