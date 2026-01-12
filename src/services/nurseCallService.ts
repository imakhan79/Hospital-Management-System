
import { CallRequest, NurseStation, CallStats } from "@/types/nurseCall";

// Generate 50 patients data
const generatePatients = () => {
  const patients = [];
  const names = [
    'Muhammad Ali', 'Ahmad Hassan', 'Ali Ahmed', 'Usman Khan', 'Hassan Ali',
    'Fatima Shah', 'Ayesha Khan', 'Zainab Ahmed', 'Mariam Qureshi', 'Sana Malik',
    'Imran Khan', 'Bilal Ahmed', 'Tariq Mahmood', 'Shahid Malik', 'Faisal Iqbal',
    'Khadija Hassan', 'Rabia Ahmed', 'Farah Khan', 'Nadia Hussain', 'Rubina Iqbal',
    'Kamran Shah', 'Rashid Ali', 'Naveed Ahmed', 'Zahid Hussain', 'Asif Khan',
    'Saima Mahmood', 'Uzma Ali', 'Shazia Ahmed', 'Nabila Khan', 'Samina Shah',
    'Saeed Ahmad', 'Wasim Akram', 'Aamir Khan', 'Farhan Ali', 'Waqar Younis',
    'Fouzia Malik', 'Nasreen Ahmed', 'Shaista Ali', 'Rukhsana Khan', 'Bushra Hassan',
    'Shoaib Malik', 'Salman Khan', 'Zubair Ahmed', 'Kashif Mahmood', 'Rizwan Ali',
    'Sultana Ahmed', 'Yasmeen Shah', 'Parveen Malik', 'Nargis Ali', 'Amina Khan'
  ];

  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency', 'General Medicine', 'Pediatrics', 'ICU'];
  
  for (let i = 0; i < 50; i++) {
    patients.push({
      id: `patient-${i + 1}`,
      name: names[i],
      room_number: `${Math.floor(Math.random() * 3) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`,
      department: departments[Math.floor(Math.random() * departments.length)]
    });
  }
  
  return patients;
};

const SAMPLE_PATIENTS = generatePatients();

export async function fetchActiveCalls(): Promise<CallRequest[]> {
  // Generate realistic active calls
  const mockCalls: CallRequest[] = [];
  const callTypes = ['emergency', 'assistance', 'pain', 'medication', 'bathroom', 'general'];
  const priorities = ['critical', 'high', 'medium', 'low'];
  const statuses = ['pending', 'acknowledged', 'in_progress'];
  
  // Generate 5-8 active calls
  const numCalls = Math.floor(Math.random() * 4) + 5;
  
  for (let i = 0; i < numCalls; i++) {
    const patient = SAMPLE_PATIENTS[Math.floor(Math.random() * SAMPLE_PATIENTS.length)];
    const callType = callTypes[Math.floor(Math.random() * callTypes.length)] as any;
    const priority = priorities[Math.floor(Math.random() * priorities.length)] as any;
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    
    const timestamp = new Date(Date.now() - Math.random() * 30 * 60000); // 0-30 minutes ago
    
    const call: CallRequest = {
      id: `call-${Date.now()}-${i}`,
      patient_id: patient.id,
      patient_name: patient.name,
      room_number: patient.room_number,
      department: patient.department,
      call_type: callType,
      priority: priority,
      status: status,
      timestamp: timestamp.toISOString(),
      voice_call_enabled: Math.random() > 0.3
    };
    
    if (status !== 'pending') {
      call.acknowledged_at = new Date(timestamp.getTime() + Math.random() * 5 * 60000).toISOString();
      call.assigned_nurse_id = `nurse-${Math.floor(Math.random() * 10) + 1}`;
      call.assigned_nurse_name = `Nurse ${['Sarah', 'Ahmed', 'Fatima', 'Ali', 'Zainab'][Math.floor(Math.random() * 5)]}`;
    }
    
    if (status === 'in_progress') {
      call.responded_at = new Date(timestamp.getTime() + Math.random() * 10 * 60000).toISOString();
    }
    
    mockCalls.push(call);
  }

  return mockCalls.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

export async function fetchNurseStations(): Promise<NurseStation[]> {
  const mockStations: NurseStation[] = [
    {
      id: 'station-1',
      name: 'ICU Station',
      department: 'Intensive Care',
      active_calls: Math.floor(Math.random() * 3) + 1,
      staff_on_duty: 6,
      last_updated: new Date().toISOString()
    },
    {
      id: 'station-2',
      name: 'Emergency Station',
      department: 'Emergency',
      active_calls: Math.floor(Math.random() * 4) + 2,
      staff_on_duty: 8,
      last_updated: new Date().toISOString()
    },
    {
      id: 'station-3',
      name: 'Cardiology Station',
      department: 'Cardiology',
      active_calls: Math.floor(Math.random() * 2) + 1,
      staff_on_duty: 4,
      last_updated: new Date().toISOString()
    },
    {
      id: 'station-4',
      name: 'General Medicine Station',
      department: 'General Medicine',
      active_calls: Math.floor(Math.random() * 3) + 1,
      staff_on_duty: 5,
      last_updated: new Date().toISOString()
    }
  ];

  return mockStations;
}

export async function fetchCallStats(): Promise<CallStats> {
  return {
    total_calls_today: Math.floor(Math.random() * 20) + 80,
    pending_calls: Math.floor(Math.random() * 5) + 3,
    average_response_time: Math.floor(Math.random() * 120) + 60, // 1-3 minutes
    critical_alerts: Math.floor(Math.random() * 3),
    resolved_calls: Math.floor(Math.random() * 15) + 75
  };
}

export async function acknowledgeCall(callId: string, nurseId: string, nurseName: string): Promise<{ success: boolean }> {
  console.log(`Call ${callId} acknowledged by ${nurseName} (${nurseId})`);
  return { success: true };
}

export async function respondToCall(callId: string): Promise<{ success: boolean }> {
  console.log(`Nurse responding to call ${callId}`);
  return { success: true };
}

export async function resolveCall(callId: string, notes?: string): Promise<{ success: boolean }> {
  console.log(`Call ${callId} resolved with notes: ${notes}`);
  return { success: true };
}

export async function createCall(callData: Omit<CallRequest, 'id' | 'timestamp'>): Promise<{ success: boolean, callId?: string }> {
  const callId = `call-${Date.now()}`;
  console.log(`New call created: ${callId}`, callData);
  return { success: true, callId };
}

export async function fetchPatientCallHistory(patientId: string): Promise<CallRequest[]> {
  // Generate call history for patient
  const mockHistory: CallRequest[] = [];
  const callTypes = ['assistance', 'medication', 'bathroom', 'general'];
  
  for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
    const patient = SAMPLE_PATIENTS.find(p => p.id === patientId) || SAMPLE_PATIENTS[0];
    const days = Math.floor(Math.random() * 7);
    const timestamp = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    mockHistory.push({
      id: `hist-call-${i}`,
      patient_id: patientId,
      patient_name: patient.name,
      room_number: patient.room_number,
      department: patient.department,
      call_type: callTypes[Math.floor(Math.random() * callTypes.length)] as any,
      priority: 'medium',
      status: 'resolved',
      timestamp: timestamp.toISOString(),
      resolved_at: new Date(timestamp.getTime() + 15 * 60000).toISOString(),
      response_time: Math.floor(Math.random() * 300) + 60,
      notes: `Resolved - ${['Patient assisted', 'Medication provided', 'Request completed'][Math.floor(Math.random() * 3)]}`
    });
  }
  
  return mockHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getPatientsList(): Promise<typeof SAMPLE_PATIENTS> {
  return SAMPLE_PATIENTS;
}
