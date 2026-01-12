import { supabase } from "@/integrations/supabase/client";
import { MedicalRecord } from "@/types";

export interface MedicalRecordServiceResponse {
  records: MedicalRecord[];
  count: number;
}

export async function fetchMedicalRecords(
  page = 1,
  pageSize = 10,
  searchTerm = "",
  filterOptions: Record<string, any> = {}
): Promise<MedicalRecordServiceResponse> {
  try {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // We'll skip trying to query Supabase tables that don't exist and just use mock data
    console.info("Falling back to mock medical records data");
    const mockRecords = generateMockMedicalRecords(800); // Generate more records for 200 patients
    
    // Apply filtering based on search term
    let filteredRecords = mockRecords;
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filteredRecords = mockRecords.filter(record => 
        (record.diagnosis && record.diagnosis.toLowerCase().includes(search)) ||
        (record.symptoms && record.symptoms.toLowerCase().includes(search)) ||
        (record.treatment && record.treatment.toLowerCase().includes(search)) ||
        (record.doctor && record.doctor.toLowerCase().includes(search)) ||
        (record.department && record.department.toLowerCase().includes(search))
      );
    }
    
    // Apply additional filters if provided
    if (filterOptions) {
      if (filterOptions.department && filterOptions.department !== 'all_departments') {
        filteredRecords = filteredRecords.filter(record => 
          record.department === filterOptions.department
        );
      }
      if (filterOptions.doctor && filterOptions.doctor !== 'all_doctors') {
        filteredRecords = filteredRecords.filter(record => 
          record.doctor === filterOptions.doctor
        );
      }
    }
    
    // Apply pagination
    const paginatedRecords = filteredRecords.slice(from, to + 1);
    
    return {
      records: paginatedRecords,
      count: filteredRecords.length
    };
  } catch (error) {
    console.error("Error fetching medical records:", error);
    throw new Error("Failed to fetch medical records");
  }
}

export async function fetchMedicalRecordById(id: string): Promise<MedicalRecord | null> {
  try {
    console.info("Falling back to mock medical record data");
    const mockRecords = generateMockMedicalRecords(800);
    const record = mockRecords.find(record => record.id === id);
    
    return record || null;
  } catch (error) {
    console.error("Error fetching medical record:", error);
    return null;
  }
}

export async function createMedicalRecord(record: Omit<MedicalRecord, "id" | "created_at" | "updated_at">): Promise<{ success: boolean, error?: string, data?: MedicalRecord }> {
  try {
    console.info("Creating medical record:", record);
    
    const newRecord: MedicalRecord = {
      id: `record-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...record
    };
    
    return { success: true, data: newRecord };
  } catch (error) {
    console.error("Error creating medical record:", error);
    return { success: false, error: "Failed to create medical record" };
  }
}

export async function updateMedicalRecord(id: string, updates: Partial<MedicalRecord>): Promise<{ success: boolean, error?: string }> {
  try {
    console.info(`Updating medical record ${id}:`, updates);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating medical record:", error);
    return { success: false, error: "Failed to update medical record" };
  }
}

export async function deleteMedicalRecord(id: string): Promise<{ success: boolean, error?: string }> {
  try {
    console.info(`Deleting medical record ${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting medical record:", error);
    return { success: false, error: "Failed to delete medical record" };
  }
}

export async function fetchPatientsList(): Promise<{ id: string, name: string }[]> {
  try {
    const mockPatients = generatePatients(200);
    
    return mockPatients;
  } catch (error) {
    console.error("Error fetching patients list:", error);
    return [];
  }
}

// Function to generate patient data
function generatePatients(count: number): { id: string, name: string }[] {
  const maleNames = [
    'Muhammad Ali', 'Ahmad Hassan', 'Ali Ahmed', 'Usman Khan', 'Hassan Ali',
    'Imran Khan', 'Bilal Ahmed', 'Tariq Mahmood', 'Shahid Malik', 'Faisal Iqbal',
    'Kamran Shah', 'Rashid Ali', 'Naveed Ahmed', 'Zahid Hussain', 'Asif Khan',
    'Saeed Ahmad', 'Wasim Akram', 'Aamir Khan', 'Farhan Ali', 'Waqar Younis',
    'Shoaib Malik', 'Salman Khan', 'Zubair Ahmed', 'Kashif Mahmood', 'Rizwan Ali'
  ];

  const femaleNames = [
    'Ayesha Khan', 'Fatima Ali', 'Zainab Ahmed', 'Khadija Hassan', 'Mariam Shah',
    'Sana Malik', 'Rabia Ahmed', 'Farah Khan', 'Nadia Hussain', 'Rubina Iqbal',
    'Saima Mahmood', 'Uzma Ali', 'Shazia Ahmed', 'Nabila Khan', 'Samina Shah',
    'Fouzia Malik', 'Nasreen Ahmed', 'Shaista Ali', 'Rukhsana Khan', 'Bushra Hassan',
    'Sultana Ahmed', 'Yasmeen Shah', 'Parveen Malik', 'Nargis Ali', 'Amina Khan'
  ];

  const allNames = [...maleNames, ...femaleNames];

  return Array.from({ length: count }, (_, i) => ({
    id: `patient-${i + 1}`,
    name: allNames[i % allNames.length] || `Patient ${i + 1}`
  }));
}

// Function to generate sample medical record data
function generateMockMedicalRecords(count: number): MedicalRecord[] {
  const departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Oncology', 'Emergency', 'General Medicine'];
  
  const doctors = [
    'Dr. Muhammad Iqbal', 'Dr. Fatima Shah', 'Dr. Ahmed Ali', 'Dr. Ayesha Khan', 'Dr. Hassan Malik',
    'Dr. Zainab Ahmed', 'Dr. Usman Tariq', 'Dr. Sana Hussain', 'Dr. Ali Raza', 'Dr. Mariam Qureshi',
    'Dr. Bilal Ahmed', 'Dr. Farah Noor', 'Dr. Imran Khan', 'Dr. Nadia Ali', 'Dr. Tariq Mahmood'
  ];
  
  const commonDiagnoses = [
    'Hypertension', 'Diabetes Type 2', 'Asthma', 'Migraine', 'Arthritis', 
    'Upper Respiratory Infection', 'Gastroenteritis', 'Bronchitis', 'Pneumonia', 
    'Allergic Rhinitis', 'GERD', 'UTI', 'Sinusitis', 'Dengue Fever', 'Typhoid',
    'Hepatitis B', 'Malaria', 'Tuberculosis'
  ];
  
  const treatments = [
    'Prescribed medication', 'Physical therapy recommended', 'Surgery scheduled', 
    'Diet and exercise plan', 'Rest and increased fluid intake', 'Regular monitoring required', 
    'Referral to specialist', 'Blood tests ordered', 'X-ray examination', 'Ultrasound recommended'
  ];
  
  const medications = [
    'Paracetamol', 'Amoxicillin', 'Metformin', 'Lisinopril', 'Atorvastatin', 
    'Salbutamol', 'Ibuprofen', 'Omeprazole', 'Ciprofloxacin', 'Prednisolone',
    'Azithromycin', 'Doxycycline', 'Insulin', 'Aspirin', 'Cephalexin'
  ];
  
  const symptoms = [
    'Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Dizziness', 
    'Chest pain', 'Shortness of breath', 'Joint pain', 'Abdominal pain',
    'Vomiting', 'Diarrhea', 'Body aches', 'Sore throat', 'Loss of appetite'
  ];

  return Array.from({ length: count }, (_, i) => {
    const recordDate = new Date();
    recordDate.setDate(recordDate.getDate() - Math.floor(Math.random() * 365));
    
    const createdAt = new Date(recordDate);
    createdAt.setHours(Math.floor(Math.random() * 24));
    
    const updatedAt = new Date(createdAt);
    if (Math.random() > 0.5) {
      updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 10));
    }
    
    const selectedDepartment = departments[Math.floor(Math.random() * departments.length)];
    
    // Use patient IDs from 1 to 200 for Pakistani patients
    const patientId = `patient-${Math.floor(Math.random() * 200) + 1}`;
    
    return {
      id: `record-${i + 1}`,
      patient_id: patientId,
      record_date: recordDate.toISOString().split('T')[0],
      diagnosis: Math.random() > 0.1 ? commonDiagnoses[Math.floor(Math.random() * commonDiagnoses.length)] : null,
      symptoms: Math.random() > 0.1 ? 
        Array.from(
          { length: Math.floor(Math.random() * 3) + 1 }, 
          () => symptoms[Math.floor(Math.random() * symptoms.length)]
        ).join(', ') : null,
      treatment: Math.random() > 0.2 ? treatments[Math.floor(Math.random() * treatments.length)] : null,
      medication: Math.random() > 0.3 ? medications[Math.floor(Math.random() * medications.length)] : null,
      notes: Math.random() > 0.5 ? `Patient treatment notes for record ${i + 1}` : null,
      doctor: doctors[Math.floor(Math.random() * doctors.length)],
      department: Math.random() > 0.1 ? selectedDepartment : null,
      created_at: createdAt.toISOString(),
      updated_at: updatedAt.toISOString()
    };
  });
}
