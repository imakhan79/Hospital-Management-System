
// OPD Service with comprehensive functionality
export type VisitStatus =
  | 'booked'
  | 'checked-in'
  | 'vitals-pending'
  | 'vitals-completed'
  | 'waiting-queue'
  | 'called'
  | 'in-consultation'
  | 'consultation-completed'
  | 'orders-pending' // Lab/Radiology ordered but not done
  | 'pharmacy-pending' // Prescription exists but not dispensed
  | 'billing-pending' // Charges exist but not paid
  | 'paid'
  | 'closed'
  | 'cancelled';

export interface OPDVisit {
  id: string; // Internal unique VisitID
  visitNumber: string; // Human readable like V-1001
  patientId: string;
  patientName: string;
  patientPhone: string;
  appointmentId?: string;
  department: string;
  doctor: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'online' | 'walk-in';
  consultationType: 'physical' | 'video';
  status: VisitStatus;
  priority: 'routine' | 'urgent' | 'emergency';
  reasonForVisit: string;
  payerType: 'cash' | 'insurance';
  queueToken?: string;
  age?: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
}

export type OPDAppointment = OPDVisit;

export interface OPDQueue {
  id: string;
  department: string;
  doctorId: string;
  doctorName: string;
  currentVisitId: string | null;
  queueCount: number;
  averageConsultationTime: number;
  estimatedWaitTime: number;
  status: 'active' | 'paused' | 'closed';
}

export interface Department {
  id: string;
  name: string;
  description: string;
  doctors: Doctor[];
  availableSlots: TimeSlot[];
  consultationFee: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating: number;
  availability: DoctorAvailability[];
  consultationFee: number;
  room?: string;
  status?: 'Active' | 'Inactive';
  createdBy?: string;
  createdAt?: string;
}

export interface DoctorAvailability {
  day: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  doctor: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  phone: string;
  age?: string;
  gender: string;
  emergencyContact?: string;
  createdAt: string;
  isDeleted?: boolean;
}

// Mock Database
const mockPatients: Patient[] = [
  { id: 'p1', mrn: 'MR-2024-001', name: 'John Doe', phone: '03001234567', age: '35', gender: 'male', createdAt: new Date().toISOString() },
  { id: 'p2', mrn: 'MR-2024-002', name: 'Jane Smith', phone: '03337654321', age: '28', gender: 'female', createdAt: new Date().toISOString() }
];

export interface VitalsRecord {
  id: string;
  visitId: string;
  patientId: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  respiratoryRate?: number;
  temperature: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  painScore?: number;
  bloodSugar?: number;
  notes?: string;
  capturedBy: string;
  capturedAt: string;
  isAbnormal?: boolean;
}

export interface Prescription {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}


export interface ConsultationRecord {
  id: string;
  visitId: string;
  patientId: string;
  doctorName: string;
  chiefComplaint: string;
  diagnosis: string;
  notes?: string;
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  followUpDate?: string;
  status: 'completed' | 'admitted' | 'referred';
  dispositionNote?: string;
  completedAt: string;
  dispensed?: boolean;
}

export interface InventoryItem {
  id: string;
  drugName: string;
  stock: number;
  unitPrice: number;
  batchNo: string;
  expiryDate: string;
}

export interface DispenseRecord {
  id: string;
  visitId: string;
  patientId: string;
  items: { drugName: string, quantity: number, cost: number }[];
  totalCost: number;
  dispensedAt: string;
  paymentStatus: 'pending' | 'paid';
}

export interface Invoice {
  id: string;
  encounterId: string;
  patientId: string;
  billType: 'Registration' | 'Consultation' | 'Pharmacy' | 'Lab';
  amount: number;
  status: 'pending' | 'paid';
  generatedAt: string;
  paidAt?: string;
  paymentMethod?: 'Cash' | 'Card' | 'Online';
}

export interface LabOrder {
  testId: string;
  testName?: string;
  testCode?: string;
  urgency: 'routine' | 'urgent';
  instructions?: string;
  result?: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: string;
  price: number;
}

export interface LabRequest {
  id: string;
  visitId: string;
  patientId: string;
  testId: string;
  testName: string;
  status: 'pending' | 'sample-collected' | 'completed';
  result?: string;
  orderedAt: string;
  collectedAt?: string;
  reportedAt?: string;
}

const mockVisits: OPDVisit[] = [];
const patientVitals: VitalsRecord[] = [];
const consultations: ConsultationRecord[] = [];
export const invoices: Invoice[] = [];
export const labRequests: LabRequest[] = [];
// Mock Inventory
const inventory: InventoryItem[] = [
  { id: 'd1', drugName: 'Paracetamol 500mg', stock: 1000, unitPrice: 2, batchNo: 'B001', expiryDate: '2025-12-31' },
  { id: 'd2', drugName: 'Amoxicillin 500mg', stock: 500, unitPrice: 15, batchNo: 'B002', expiryDate: '2025-06-30' },
  { id: 'd3', drugName: 'Ibuprofen 400mg', stock: 800, unitPrice: 5, batchNo: 'B003', expiryDate: '2025-10-15' },
  { id: 'd4', drugName: 'Cetirizine 10mg', stock: 600, unitPrice: 10, batchNo: 'B004', expiryDate: '2025-08-20' },
  { id: 'd5', drugName: 'Pantoprazole 40mg', stock: 400, unitPrice: 12, batchNo: 'B005', expiryDate: '2025-11-01' },
];
const dispenseRecords: DispenseRecord[] = [];

// Mock Lab Tests
export const labTests: LabTest[] = [
  { id: 'l1', name: 'CBC (Complete Blood Count)', category: 'Hematology', price: 15 },
  { id: 'l2', name: 'Lipid Profile', category: 'Biochemistry', price: 25 },
  { id: 'l3', name: 'LFT (Liver Function Test)', category: 'Biochemistry', price: 20 },
  { id: 'l4', name: 'RBS (Random Blood Sugar)', category: 'Biochemistry', price: 5 },
  { id: 'l5', name: 'Chest X-Ray PA View', category: 'Radiology', price: 30 },
];

// Sample departments data
export const departments: Department[] = [
  {
    id: 'gastro',
    name: 'Gastroenterology',
    description: 'Digestive system disorders and diseases',
    doctors: [
      {
        id: 'dr-gastro-1',
        name: 'Dr. Sarah Ahmed',
        specialization: 'Gastroenterology',
        qualification: 'MBBS, MD',
        experience: 12,
        rating: 4.8,
        consultationFee: 1500,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
          { day: 'Friday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
        ]
      },
      {
        id: 'dr-gastro-2',
        name: 'Dr. Mohammad Ali',
        specialization: 'Gastroenterology',
        qualification: 'MBBS, FCPS',
        experience: 8,
        rating: 4.6,
        consultationFee: 1200,
        availability: [
          { day: 'Monday', startTime: '14:00', endTime: '20:00', maxPatients: 15 },
          { day: 'Tuesday', startTime: '14:00', endTime: '20:00', maxPatients: 15 },
          { day: 'Wednesday', startTime: '14:00', endTime: '20:00', maxPatients: 15 },
          { day: 'Thursday', startTime: '14:00', endTime: '20:00', maxPatients: 15 },
          { day: 'Saturday', startTime: '09:00', endTime: '15:00', maxPatients: 18 },
        ]
      }
    ],
    availableSlots: [],
    consultationFee: 1200
  },
  {
    id: 'gynec',
    name: 'Gynecology',
    description: 'Women\'s health and reproductive system',
    doctors: [
      {
        id: 'dr-gynec-1',
        name: 'Dr. Fatima Hassan',
        specialization: 'Gynecology & Obstetrics',
        qualification: 'MBBS, FCPS',
        experience: 15,
        rating: 4.9,
        consultationFee: 1800,
        availability: [
          { day: 'Monday', startTime: '10:00', endTime: '16:00', maxPatients: 18 },
          { day: 'Tuesday', startTime: '10:00', endTime: '16:00', maxPatients: 18 },
          { day: 'Wednesday', startTime: '10:00', endTime: '16:00', maxPatients: 18 },
          { day: 'Thursday', startTime: '10:00', endTime: '16:00', maxPatients: 18 },
          { day: 'Friday', startTime: '10:00', endTime: '16:00', maxPatients: 18 },
        ]
      },
      {
        id: 'dr-gynec-2',
        name: 'Dr. Aisha Khan',
        specialization: 'Gynecology',
        qualification: 'MBBS, MD',
        experience: 10,
        rating: 4.7,
        consultationFee: 1500,
        availability: [
          { day: 'Monday', startTime: '15:00', endTime: '21:00', maxPatients: 12 },
          { day: 'Tuesday', startTime: '15:00', endTime: '21:00', maxPatients: 12 },
          { day: 'Wednesday', startTime: '15:00', endTime: '21:00', maxPatients: 12 },
          { day: 'Saturday', startTime: '09:00', endTime: '15:00', maxPatients: 15 },
          { day: 'Sunday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
        ]
      }
    ],
    availableSlots: [],
    consultationFee: 1500
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Child healthcare and development',
    doctors: [
      {
        id: 'dr-ped-1',
        name: 'Dr. Ahmad Raza',
        specialization: 'Pediatrics',
        qualification: 'MBBS, FCPS',
        experience: 18,
        rating: 4.9,
        consultationFee: 1600,
        availability: [
          { day: 'Monday', startTime: '08:00', endTime: '14:00', maxPatients: 25 },
          { day: 'Tuesday', startTime: '08:00', endTime: '14:00', maxPatients: 25 },
          { day: 'Wednesday', startTime: '08:00', endTime: '14:00', maxPatients: 25 },
          { day: 'Thursday', startTime: '08:00', endTime: '14:00', maxPatients: 25 },
          { day: 'Friday', startTime: '08:00', endTime: '14:00', maxPatients: 25 },
          { day: 'Saturday', startTime: '08:00', endTime: '12:00', maxPatients: 15 },
        ]
      },
      {
        id: 'dr-ped-2',
        name: 'Dr. Zainab Malik',
        specialization: 'Pediatrics',
        qualification: 'MBBS, MD',
        experience: 12,
        rating: 4.8,
        consultationFee: 1400,
        availability: [
          { day: 'Monday', startTime: '16:00', endTime: '22:00', maxPatients: 20 },
          { day: 'Tuesday', startTime: '16:00', endTime: '22:00', maxPatients: 20 },
          { day: 'Wednesday', startTime: '16:00', endTime: '22:00', maxPatients: 20 },
          { day: 'Thursday', startTime: '16:00', endTime: '22:00', maxPatients: 20 },
          { day: 'Friday', startTime: '16:00', endTime: '22:00', maxPatients: 20 },
        ]
      }
    ],
    availableSlots: [],
    consultationFee: 1400
  },
  {
    id: 'surgery',
    name: 'General Surgery',
    description: 'Surgical procedures and consultations',
    doctors: [
      {
        id: 'dr-surg-1',
        name: 'Dr. Hassan Mahmood',
        specialization: 'General Surgery',
        qualification: 'MBBS, FCPS',
        experience: 20,
        rating: 4.9,
        consultationFee: 2000,
        availability: [
          { day: 'Monday', startTime: '11:00', endTime: '15:00', maxPatients: 12 },
          { day: 'Tuesday', startTime: '11:00', endTime: '15:00', maxPatients: 12 },
          { day: 'Wednesday', startTime: '11:00', endTime: '15:00', maxPatients: 12 },
          { day: 'Thursday', startTime: '11:00', endTime: '15:00', maxPatients: 12 },
          { day: 'Friday', startTime: '11:00', endTime: '15:00', maxPatients: 12 },
        ]
      }
    ],
    availableSlots: [],
    consultationFee: 2000
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular system',
    doctors: [
      {
        id: 'dr-card-1',
        name: 'Dr. Omar Sheikh',
        specialization: 'Cardiology',
        qualification: 'MBBS, FCPS, Fellowship',
        experience: 22,
        rating: 4.9,
        consultationFee: 2500,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
          { day: 'Wednesday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
          { day: 'Friday', startTime: '09:00', endTime: '13:00', maxPatients: 10 },
        ]
      }
    ],
    availableSlots: [],
    consultationFee: 2500
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin, hair, and nail conditions',
    doctors: [
      {
        id: 'dr-derm-1',
        name: 'Dr. Nadia Tariq',
        specialization: 'Dermatology',
        qualification: 'MBBS, FCPS',
        experience: 14,
        rating: 4.8,
        consultationFee: 1700,
        availability: [
          { day: 'Monday', startTime: '14:00', endTime: '18:00', maxPatients: 16 },
          { day: 'Tuesday', startTime: '14:00', endTime: '18:00', maxPatients: 16 },
          { day: 'Wednesday', startTime: '14:00', endTime: '18:00', maxPatients: 16 },
          { day: 'Thursday', startTime: '14:00', endTime: '18:00', maxPatients: 16 },
          { day: 'Saturday', startTime: '10:00', endTime: '14:00', maxPatients: 12 },
        ]
      }
    ],
    availableSlots: [],
    consultationFee: 1700
  }
];

// Workflow Engine: Calculate Next Step
export function calculateNextStep(visit: OPDVisit): { label: string, tab: string } {
  const pendingInvoices = invoices.filter(i => i.encounterId === visit.id && i.status === 'pending');
  const pendingLab = labRequests.filter(r => r.visitId === visit.id && r.status !== 'completed');
  const consultation = consultations.find(c => c.visitId === visit.id);

  if (visit.status === 'booked' || visit.status === 'cancelled') {
    return { label: 'Check-in Patient', tab: 'checkin' };
  }
  if (visit.status === 'checked-in' || visit.status === 'vitals-pending') {
    return { label: 'Record Vitals', tab: 'vitals' };
  }
  if (visit.status === 'vitals-completed' || (visit.status === 'waiting-queue' && !visit.queueToken)) {
    return { label: 'Assign Queue', tab: 'queue' };
  }
  if (visit.status === 'waiting-queue' || visit.status === 'called') {
    return { label: 'Go to Consultation', tab: 'doctor' };
  }
  if (visit.status === 'in-consultation') {
    return { label: 'Finish Consultation', tab: 'doctor' };
  }
  if (pendingLab.length > 0) {
    return { label: 'Process Lab Orders', tab: 'lab' };
  }
  if (consultation && !consultation.dispensed && consultation.prescriptions.length > 0) {
    return { label: 'Dispense Medicines', tab: 'pharmacy' };
  }
  if (pendingInvoices.length > 0) {
    return { label: 'Collect Payment', tab: 'billing' };
  }
  if (visit.status === 'paid') {
    return { label: 'Close Visit & Print Report', tab: 'reports' };
  }

  return { label: 'View Dashboard', tab: 'dashboard' };
}

// Generate sample visits data
const generateSampleVisits = (): OPDVisit[] => {
  const visits: OPDVisit[] = [];
  const patientNames = [
    'Ahmed Hassan', 'Fatima Khan', 'Mohammad Ali', 'Aisha Ahmed', 'Omar Sheikh',
    'Zainab Malik', 'Hassan Mahmood', 'Nadia Tariq', 'Yasir Qureshi', 'Sana Butt'
  ];

  for (let i = 0; i < 50; i++) {
    const dept = departments[i % departments.length];
    const doctor = dept.doctors[i % dept.doctors.length];

    visits.push({
      id: `v-${i + 1}`,
      visitNumber: `V${String(i + 1).padStart(4, '0')}`,
      patientId: `p${(i % 2) + 1}`,
      patientName: patientNames[i % patientNames.length],
      patientPhone: '03001234567',
      department: dept.name,
      doctor: doctor.name,
      doctorId: doctor.id,
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'walk-in',
      consultationType: 'physical',
      status: ['checked-in', 'vitals-completed', 'in-consultation', 'paid'][i % 4] as any,
      priority: 'routine',
      reasonForVisit: 'General checkup',
      payerType: 'cash',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return visits;
};

export const sampleVisits = generateSampleVisits();

export const sampleQueues: OPDQueue[] = departments.map(dept => ({
  id: `queue-${dept.id}`,
  department: dept.name,
  doctorId: dept.doctors[0].id,
  doctorName: dept.doctors[0].name,
  currentVisitId: null,
  queueCount: 5,
  averageConsultationTime: 15,
  estimatedWaitTime: 45,
  status: 'active'
}));

// Service functions
export async function fetchOPDVisits(): Promise<OPDVisit[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return sampleVisits;
}

export async function fetchOPDQueues(): Promise<OPDQueue[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return sampleQueues;
}

export async function fetchDepartments(): Promise<Department[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return departments;
}

export interface AppointmentData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientId: string;
  department: string;
  doctor: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: 'online' | 'walk-in';
  consultationType: 'physical' | 'video';
  symptoms?: string;
  notes?: string;
}

export async function createAppointment(data: any): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const appointmentNumber = `APP-${Math.floor(Math.random() * 9000) + 1000}`;

  // also create a visit if it's a walk-in or just for consistency
  const newVisit: OPDVisit = {
    id: `v-${Date.now()}`,
    visitNumber: appointmentNumber,
    patientId: data.patientId || `P-${Date.now()}`,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    department: data.department,
    doctor: data.doctor,
    doctorId: data.doctorId || 'dr-unknown',
    date: data.appointmentDate,
    time: data.appointmentTime,
    type: data.appointmentType,
    status: data.appointmentType === 'walk-in' ? 'checked-in' : 'booked',
    consultationType: data.consultationType,
    reasonForVisit: data.symptoms || '',
    priority: 'routine',
    payerType: 'cash',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  sampleVisits.push(newVisit);

  return {
    ...newVisit,
    appointmentNumber: appointmentNumber
  };
}

export async function createVisit(data: Partial<OPDVisit>): Promise<OPDVisit> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newVisit: OPDVisit = {
    id: `v-${Date.now()}`,
    visitNumber: `V${String(sampleVisits.length + 1).padStart(4, '0')}`,
    patientId: data.patientId || `P${String(sampleVisits.length + 1).padStart(4, '0')}`,
    patientName: data.patientName || '',
    patientPhone: data.patientPhone || '',
    department: data.department || '',
    doctor: data.doctor || '',
    doctorId: data.doctorId || '',
    date: data.date || new Date().toISOString().split('T')[0],
    time: data.time || '09:00',
    type: data.type || 'online',
    status: 'booked',
    consultationType: data.consultationType || 'physical',
    reasonForVisit: data.reasonForVisit || '',
    priority: data.priority || 'routine',
    payerType: data.payerType || 'cash',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  sampleVisits.push(newVisit);
  return newVisit;
}

export async function getAvailableSlots(departmentId: string, doctorId: string, date: string): Promise<TimeSlot[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      slots.push({
        time,
        available: Math.random() > 0.3, // 70% chance of being available
        doctor: doctorId
      });
    }
  }

  return slots;
}

export async function addNewDoctor(doctor: Partial<Doctor>, departmentName: string): Promise<Doctor> {
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay

  const dept = departments.find(d => d.name === departmentName);
  if (!dept) throw new Error("Department not found");

  // Check duplicate
  const exists = dept.doctors.find(d => d.name.toLowerCase() === doctor.name?.toLowerCase());
  if (exists) throw new Error("Doctor already exists in this department");

  const newDoc: Doctor = {
    id: `dr-${doctor.name?.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
    name: doctor.name!,
    specialization: doctor.specialization || dept.name,
    qualification: doctor.qualification || 'MBBS',
    experience: doctor.experience || 1,
    rating: 5.0,
    consultationFee: doctor.consultationFee || dept.consultationFee,
    room: doctor.room,
    status: doctor.status || 'Active',
    createdBy: doctor.createdBy,
    createdAt: new Date().toISOString(),
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', maxPatients: 20 },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', maxPatients: 20 }
    ]
  };

  dept.doctors.push(newDoc);
  return newDoc;
}

export async function fetchPatientVitals(patientId: string): Promise<VitalsRecord[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return patientVitals.filter(v => v.patientId === patientId).sort((a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime());
}

// --- Vitals Station Service Functions ---

export async function getVitalsQueue(
  filters?: {
    date?: string;
    department?: string;
    doctor?: string;
    search?: string;
  }
): Promise<OPDVisit[]> {
  await new Promise(resolve => setTimeout(resolve, 400));

  let queue = sampleVisits.filter(v =>
    ['checked-in', 'vitals-pending'].includes(v.status)
  );

  if (filters?.department && filters.department !== 'All Departments') {
    queue = queue.filter(v => v.department === filters.department);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    queue = queue.filter(v =>
      v.patientName.toLowerCase().includes(q) ||
      v.visitNumber.toLowerCase().includes(q) ||
      v.patientPhone.includes(q)
    );
  }

  return queue.sort((a, b) => a.time.localeCompare(b.time));
}

export async function updateVisitStatus(
  id: string,
  status: VisitStatus,
  notes?: string
): Promise<OPDVisit> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const visit = sampleVisits.find(v => v.id === id);
  if (!visit) throw new Error("Visit not found");

  visit.status = status;
  visit.updatedAt = new Date().toISOString();
  if (notes) visit.reasonForVisit = (visit.reasonForVisit ? visit.reasonForVisit + "\n" : "") + notes;

  return visit;
}

export const fetchOPDAppointments = fetchOPDVisits;
export const updateAppointmentStatus = updateVisitStatus;
export const sampleAppointments = sampleVisits;

export async function submitVitals(
  vitals: Omit<VitalsRecord, 'id' | 'capturedAt'>
): Promise<VitalsRecord> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newRecord: VitalsRecord = {
    ...vitals,
    id: `vit-${Date.now()}`,
    capturedAt: new Date().toISOString()
  };
  patientVitals.push(newRecord);

  const visit = sampleVisits.find(v => v.id === vitals.visitId);
  if (visit) {
    visit.status = 'vitals-completed';
    visit.updatedAt = new Date().toISOString();
  }

  return newRecord;
}


// --- Doctor Station Service Functions ---

export async function getDoctorQueue(
  doctorId?: string
): Promise<OPDVisit[]> {
  await new Promise(resolve => setTimeout(resolve, 400));

  let queue = sampleVisits.filter(v =>
    ['waiting-queue', 'called', 'in-consultation'].includes(v.status)
  );

  if (doctorId) {
    queue = queue.filter(v => v.doctorId === doctorId);
  }

  return queue.sort((a, b) => a.time.localeCompare(b.time));
}

export async function saveConsultation(
  record: Omit<ConsultationRecord, 'id' | 'completedAt'>
): Promise<ConsultationRecord> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newRecord: ConsultationRecord = {
    ...record,
    id: `cons-${Date.now()}`,
    completedAt: new Date().toISOString()
  };

  consultations.push(newRecord);

  const visit = sampleVisits.find(v => v.id === record.visitId);

  // Create Lab Requests from Consultation
  if (record.labOrders && record.labOrders.length > 0) {
    record.labOrders.forEach(order => {
      const test = labTests.find(t => t.id === order.testId) || { name: order.testId, price: 0 };

      labRequests.push({
        id: `req-${Date.now()}-${Math.random()}`,
        visitId: record.visitId,
        patientId: visit?.patientId || "",
        testId: order.testId,
        testName: test.name,
        status: 'pending',
        orderedAt: new Date().toISOString()
      });
    });
  }

  // Generate Consultation Invoice
  const doctorDept = departments.find(d => d.doctors.some(doc => doc.name === record.doctorName));
  const doc = doctorDept?.doctors.find(d => d.name === record.doctorName);
  const fee = doc?.consultationFee || 1000;

  invoices.push({
    id: `inv-cons-${Date.now()}`,
    encounterId: record.visitId,
    patientId: record.patientId,
    billType: 'Consultation',
    amount: fee,
    status: 'pending',
    generatedAt: new Date().toISOString()
  });

  // Update Visit Status based on orders
  if (visit) {
    if (record.labOrders && record.labOrders.length > 0) {
      visit.status = 'orders-pending';
    } else if (record.prescriptions && record.prescriptions.length > 0) {
      visit.status = 'pharmacy-pending';
    } else {
      visit.status = 'billing-pending';
    }
    visit.updatedAt = new Date().toISOString();
  }

  return newRecord;
}

// --- Pharmacy Service Functions ---

export async function getPharmacyQueue(): Promise<{ visit: OPDVisit, consultation: ConsultationRecord }[]> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const pending = consultations.filter(c => !c.dispensed);

  const queue = pending.map(c => {
    const visit = sampleVisits.find(v => v.id === c.visitId);
    return visit ? { visit, consultation: c } : null;
  }).filter(item => item !== null) as { visit: OPDVisit, consultation: ConsultationRecord }[];

  return queue;
}

export async function getInventory(): Promise<InventoryItem[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return inventory;
}

export async function dispenseMedicines(
  record: Omit<DispenseRecord, 'id' | 'dispensedAt'>
): Promise<DispenseRecord> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const newRecord: DispenseRecord = {
    ...record,
    id: `disp-${Date.now()}`,
    dispensedAt: new Date().toISOString()
  };
  dispenseRecords.push(newRecord);

  const consultation = consultations.find(c => c.visitId === record.visitId);
  if (consultation) {
    consultation.dispensed = true;
  }

  // Update Inventory (Simple mock decrement)
  record.items.forEach(item => {
    const invItem = inventory.find(i => i.drugName === item.drugName);
    if (invItem) {
      invItem.stock -= item.quantity;
    }
  });

  // Create Invoice for Pharmacy
  if (record.totalCost > 0) {
    invoices.push({
      id: `inv-ph-${Date.now()}`,
      encounterId: record.visitId,
      patientId: record.patientId,
      billType: 'Pharmacy',
      amount: record.totalCost,
      status: 'pending',
      generatedAt: new Date().toISOString()
    });
  }

  // Update Visit Status
  const visit = sampleVisits.find(v => v.id === record.visitId);
  if (visit) {
    visit.status = 'billing-pending';
    visit.updatedAt = new Date().toISOString();
  }

  return newRecord;
}

// --- Billing Service Functions ---

export async function getBillingQueue(): Promise<{ invoice: Invoice, visit: OPDVisit }[]> {
  await new Promise(resolve => setTimeout(resolve, 300));

  sampleVisits.forEach(v => {
    const exists = invoices.find(i => i.encounterId === v.id && i.billType === 'Registration');
    if (!exists && v.type === 'walk-in') {
      invoices.push({
        id: `inv-reg-${v.id}`,
        encounterId: v.id,
        patientId: v.patientId,
        billType: 'Registration',
        amount: 500,
        status: 'pending',
        generatedAt: v.createdAt
      });
    }
  });

  const pending = invoices.filter(i => i.status === 'pending');

  return pending.map(inv => {
    let visit = sampleVisits.find(v => v.id === inv.encounterId);

    if (!visit) {
      const patient = mockPatients.find(p => p.id === inv.patientId);
      if (patient) {
        visit = {
          id: inv.encounterId,
          visitNumber: 'IPD-BILL',
          patientId: patient.id,
          patientName: patient.name,
          patientPhone: patient.phone,
          department: 'In-Patient',
          doctor: 'Hospital',
          doctorId: 'hosp',
          date: new Date().toISOString().split('T')[0],
          time: '',
          type: 'walk-in',
          consultationType: 'physical',
          status: 'closed',
          priority: 'routine',
          reasonForVisit: 'IPD Discharge',
          payerType: 'cash',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }

    return visit ? { invoice: inv, visit } : null;
  }).filter(i => i !== null) as { invoice: Invoice, visit: OPDVisit }[];
}

export async function processPayment(invoiceId: string, method: 'Cash' | 'Card'): Promise<Invoice> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const inv = invoices.find(i => i.id === invoiceId);
  if (!inv) throw new Error("Invoice not found");

  inv.status = 'paid';
  inv.paidAt = new Date().toISOString();
  inv.paymentMethod = method;

  // Update Dispense Record if it was pharmacy
  if (inv.billType === 'Pharmacy') {
    const disp = dispenseRecords.find(d => d.visitId === inv.encounterId);
    if (disp) disp.paymentStatus = 'paid';
  }

  return inv;
}

// Patient Service (Mock)
export async function searchPatients(query: string): Promise<Patient[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const lowerQuery = query.toLowerCase();
  return mockPatients.filter(p => !p.isDeleted && (
    p.name.toLowerCase().includes(lowerQuery) ||
    p.mrn.toLowerCase().includes(lowerQuery) ||
    p.phone.includes(query)
  ));
}

export async function checkDuplicates(name: string, phone: string): Promise<Patient[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPatients.filter(p => !p.isDeleted && (
    (p.name.toLowerCase() === name.toLowerCase() && p.phone === phone) ||
    p.phone === phone
  ));
}

export async function createPatient(data: Partial<Patient>): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newPatient: Patient = {
    id: `p-${Date.now()}`,
    mrn: `MR-${new Date().getFullYear()}-${String(mockPatients.length + 1).padStart(4, '0')}`,
    name: data.name!,
    phone: data.phone!,
    age: data.age,
    gender: data.gender!,
    emergencyContact: data.emergencyContact,
    createdAt: new Date().toISOString()
  };
  mockPatients.push(newPatient);
  return newPatient;
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const patient = mockPatients.find(p => p.id === id);
  if (!patient) throw new Error("Patient not found");
  Object.assign(patient, data);
  return patient;
}

export async function deletePatient(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const patient = mockPatients.find(p => p.id === id);
  if (patient) patient.isDeleted = true;
}

export async function getOPDMetrics() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    visits: sampleVisits,
    invoices: invoices,
    labRequests: labRequests,
    pharmacyDispenses: dispenseRecords
  };
}

// --- Lab Service Functions ---

export async function getLabQueue(): Promise<LabRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return labRequests.sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime());
}

export async function updateLabStatus(
  id: string,
  status: LabRequest['status'],
  result?: string
): Promise<LabRequest> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const req = labRequests.find(r => r.id === id);
  if (!req) throw new Error("Lab Request not found");

  req.status = status;

  if (status === 'sample-collected') {
    req.collectedAt = new Date().toISOString();
  }

  if (status === 'completed') {
    req.reportedAt = new Date().toISOString();
    if (result) req.result = result;

    // Generate Invoice for Lab Test
    const test = labTests.find(t => t.id === req.testId) || { price: 0 };
    if (test.price > 0) {
      invoices.push({
        id: `inv-lab-${Date.now()}`,
        encounterId: req.visitId,
        patientId: req.patientId,
        billType: 'Lab' as any,
        amount: test.price,
        status: 'pending',
        generatedAt: new Date().toISOString()
      });
    }

    // Workflow Integration: Check if all labs are done
    const visit = sampleVisits.find(v => v.id === req.visitId);
    if (visit) {
      const pendingLabs = labRequests.filter(lr => lr.visitId === visit.id && lr.status !== 'completed');
      if (pendingLabs.length === 0) {
        // All labs done, check for pharmacy
        const consultation = consultations.find(c => c.visitId === visit.id);
        if (consultation && !consultation.dispensed && consultation.prescriptions.length > 0) {
          visit.status = 'pharmacy-pending';
        } else {
          visit.status = 'billing-pending';
        }
        visit.updatedAt = new Date().toISOString();
      }
    }
  }

  return req;
}

export async function createLabOrder(order: Omit<LabRequest, 'id' | 'status' | 'orderedAt'>): Promise<LabRequest> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newRequest: LabRequest = {
    ...order,
    id: `lr-${Date.now()}`,
    status: 'pending',
    orderedAt: new Date().toISOString()
  };
  labRequests.push(newRequest);
  return newRequest;
}

