
// Comprehensive system service with integrated dummy data
import { CallRequest, CallStats } from "@/types/nurseCall";

// Generate comprehensive patient data
export const generateSystemPatients = () => {
  const patients = [];
  const names = [
    'Muhammad Ali', 'Ahmad Hassan', 'Ali Ahmed', 'Usman Khan', 'Hassan Ali',
    'Fatima Shah', 'Ayesha Khan', 'Zainab Ahmed', 'Mariam Qureshi', 'Sana Malik',
    'Imran Khan', 'Bilal Ahmed', 'Tariq Mahmood', 'Shahid Malik', 'Faisal Iqbal',
    'Khadija Hassan', 'Rabia Ahmed', 'Farah Khan', 'Nadia Hussain', 'Rubina Iqbal'
  ];

  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency', 'General Medicine', 'Pediatrics', 'ICU'];
  const conditions = ['Hypertension', 'Diabetes', 'Heart Disease', 'Pneumonia', 'Fracture', 'Asthma', 'Infection'];
  
  for (let i = 0; i < 50; i++) {
    patients.push({
      id: `patient-${i + 1}`,
      patient_id: `P${String(i + 1).padStart(4, '0')}`,
      name: names[i % names.length],
      first_name: names[i % names.length].split(' ')[0],
      last_name: names[i % names.length].split(' ')[1] || 'Khan',
      room_number: `${Math.floor(Math.random() * 3) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      admission_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      age: Math.floor(Math.random() * 60) + 20,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      status: ['Stable', 'Critical', 'Improving', 'Monitoring'][Math.floor(Math.random() * 4)],
      contact_number: `+92-300-${Math.floor(Math.random() * 9000000) + 1000000}`,
      emergency_contact: `Emergency Contact ${i + 1}`,
      blood_type: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'][Math.floor(Math.random() * 8)]
    });
  }
  
  return patients;
};

// Generate staff data
export const generateStaffData = () => {
  const staff = [];
  const roles = ['Doctor', 'Nurse', 'Technician', 'Administrator', 'Pharmacist', 'Lab Technician'];
  const departments = ['Cardiology', 'Neurology', 'Emergency', 'Surgery', 'Pediatrics', 'ICU', 'Pharmacy', 'Laboratory'];
  const names = [
    'Dr. Sarah Ahmed', 'Dr. Ali Hassan', 'Nurse Fatima', 'Tech. Ahmad', 'Dr. Zainab Shah',
    'Nurse Mariam', 'Dr. Usman Khan', 'Tech. Bilal', 'Admin. Ayesha', 'Pharm. Hassan'
  ];

  for (let i = 0; i < 25; i++) {
    staff.push({
      id: `staff-${i + 1}`,
      staff_id: `S${String(i + 1).padStart(4, '0')}`,
      name: names[i % names.length],
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      shift: ['Morning', 'Evening', 'Night'][Math.floor(Math.random() * 3)],
      status: ['On Duty', 'Off Duty', 'Break'][Math.floor(Math.random() * 3)],
      experience: `${Math.floor(Math.random() * 15) + 1} years`,
      contact: `+92-300-${Math.floor(Math.random() * 9000000) + 1000000}`,
      specialization: ['Cardiology', 'Emergency Care', 'Surgery', 'Pediatrics'][Math.floor(Math.random() * 4)]
    });
  }

  return staff;
};

// Generate inventory data
export const generateInventoryData = () => {
  const items = [];
  const categories = ['Medications', 'Surgical Equipment', 'Medical Supplies', 'Laboratory', 'Emergency'];
  const itemNames = [
    'Paracetamol', 'Surgical Gloves', 'Syringes', 'Blood Test Kit', 'Oxygen Mask',
    'Bandages', 'Antibiotics', 'Thermometer', 'Stethoscope', 'IV Drip Set',
    'Surgical Mask', 'Hand Sanitizer', 'Blood Pressure Monitor', 'Insulin', 'Gauze'
  ];

  for (let i = 0; i < 50; i++) {
    const currentStock = Math.floor(Math.random() * 1000) + 50;
    const minStock = Math.floor(Math.random() * 100) + 20;
    items.push({
      id: `item-${i + 1}`,
      name: itemNames[i % itemNames.length] + ` ${Math.floor(i / itemNames.length) + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      current_stock: currentStock,
      minimum_stock: minStock,
      status: currentStock < minStock ? 'Low Stock' : 'In Stock',
      unit_price: Math.floor(Math.random() * 1000) + 50,
      supplier: `Supplier ${Math.floor(Math.random() * 5) + 1}`,
      expiry_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_updated: new Date().toISOString()
    });
  }

  return items;
};

// Generate pharmacy data
export const generatePharmacyData = () => {
  const medications = [];
  const drugNames = [
    'Paracetamol', 'Amoxicillin', 'Metformin', 'Aspirin', 'Ibuprofen',
    'Omeprazole', 'Amlodipine', 'Simvastatin', 'Lisinopril', 'Insulin'
  ];

  for (let i = 0; i < 30; i++) {
    medications.push({
      id: `med-${i + 1}`,
      name: drugNames[i % drugNames.length],
      generic_name: `Generic ${drugNames[i % drugNames.length]}`,
      strength: `${Math.floor(Math.random() * 500) + 50}mg`,
      form: ['Tablet', 'Capsule', 'Syrup', 'Injection'][Math.floor(Math.random() * 4)],
      manufacturer: `Pharma Company ${Math.floor(Math.random() * 5) + 1}`,
      batch_number: `B${Math.floor(Math.random() * 10000) + 1000}`,
      expiry_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      quantity: Math.floor(Math.random() * 1000) + 100,
      price: Math.floor(Math.random() * 500) + 50,
      prescription_required: Math.random() > 0.3
    });
  }

  return medications;
};

// Generate lab test data
export const generateLabTestData = () => {
  const tests = [];
  const testTypes = [
    'Blood Test', 'Urine Analysis', 'X-Ray', 'CT Scan', 'MRI',
    'ECG', 'Ultrasound', 'Biopsy', 'Culture Test', 'Pathology'
  ];

  for (let i = 0; i < 40; i++) {
    tests.push({
      id: `test-${i + 1}`,
      patient_id: `patient-${Math.floor(Math.random() * 50) + 1}`,
      test_type: testTypes[Math.floor(Math.random() * testTypes.length)],
      status: ['Pending', 'In Progress', 'Completed', 'Cancelled'][Math.floor(Math.random() * 4)],
      ordered_by: `Dr. ${['Ahmed', 'Hassan', 'Fatima', 'Ali', 'Zainab'][Math.floor(Math.random() * 5)]}`,
      ordered_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: ['Normal', 'Urgent', 'STAT'][Math.floor(Math.random() * 3)],
      results: Math.random() > 0.5 ? 'Normal values within range' : null,
      cost: Math.floor(Math.random() * 5000) + 500
    });
  }

  return tests;
};

// Generate billing data
export const generateBillingData = () => {
  const bills = [];
  const patients = generateSystemPatients();

  for (let i = 0; i < 30; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const amount = Math.floor(Math.random() * 50000) + 5000;
    bills.push({
      id: `bill-${i + 1}`,
      patient_id: patient.id,
      patient_name: patient.name,
      invoice_number: `INV-${String(i + 1).padStart(5, '0')}`,
      amount: amount,
      paid_amount: Math.random() > 0.3 ? amount : Math.floor(amount * 0.5),
      status: ['Paid', 'Pending', 'Overdue', 'Partial'][Math.floor(Math.random() * 4)],
      issue_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      services: [
        'Consultation Fee',
        'Laboratory Tests',
        'Medication',
        'Room Charges'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      insurance_claim: Math.random() > 0.5 ? 'Approved' : 'Pending'
    });
  }

  return bills;
};

// Export all system data
export const getSystemData = () => {
  return {
    patients: generateSystemPatients(),
    staff: generateStaffData(),
    inventory: generateInventoryData(),
    pharmacy: generatePharmacyData(),
    labTests: generateLabTestData(),
    billing: generateBillingData()
  };
};
