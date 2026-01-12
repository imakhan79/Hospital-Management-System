
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

export interface MedicalRecord {
  id: string;
  patient_id: string;
  record_date: string;
  diagnosis: string | null;
  symptoms: string | null;
  treatment: string | null;
  medication: string | null;
  notes: string | null;
  doctor: string;
  department: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category_name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  purchase_price: number;
  selling_price: number;
  expiry_date: string | null;
  location: string;
}

export interface InventoryTransaction {
  id: string;
  item_name: string;
  transaction_type: string;
  quantity: number;
  transaction_date: string;
  reference_number: string;
  notes: string;
  created_by: string;
}

export interface LabTest {
  id: string;
  patient_id: string;
  patient_name: string;
  test_type: string;
  requested_date: string;
  requested_by: string;
  result: string | null;
  status: string;
  priority: string;
  completed_date: string | null;
  comments: string | null;
}

export interface Staff {
  id: string;
  staff_id: string;
  first_name: string;
  last_name: string;
  role: string;
  department: string;
  email: string;
  contact_number: string | null;
  date_of_birth: string | null;
  hire_date: string;
  status: string;
  specialization: string | null;
  qualification: string | null;
  address: string | null;
  emergency_contact: string | null;
  emergency_contact_number: string | null;
}
