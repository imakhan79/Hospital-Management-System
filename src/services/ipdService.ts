
import { Patient, Invoice, invoices } from "./opdService";

export interface Ward {
    id: string;
    name: string;
    type: 'General' | 'Private' | 'ICU' | 'Emergency';
    floor: string;
    totalBeds: number;
    gender?: 'Male' | 'Female' | 'Mixed';
}

export interface Bed {
    id: string;
    wardId: string;
    bedNumber: string;
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
    type: 'general' | 'private' | 'icu';
    pricePerDay: number;
    patientId?: string;
    admissionId?: string;
}

export interface IPDAdmission {
    id: string;
    patientId: string;
    patientName: string; // denormalized for UI
    encounterId?: string; // Source encounter (OPD/Emergency)
    bedId: string;
    wardId: string;
    doctor: string;
    diagnosis: string;
    admittedAt: string;
    dischargedAt?: string;
    status: 'admitted' | 'discharged';
    notes?: string;
}

// Mock Data
export const mockWards: Ward[] = [
    { id: 'w1', name: 'General Ward - Male', type: 'General', floor: '1st Floor', totalBeds: 10, gender: 'Male' },
    { id: 'w2', name: 'General Ward - Female', type: 'General', floor: '1st Floor', totalBeds: 10, gender: 'Female' },
    { id: 'w3', name: 'Private Rooms', type: 'Private', floor: '2nd Floor', totalBeds: 5, gender: 'Mixed' },
    { id: 'w4', name: 'ICU', type: 'ICU', floor: '3rd Floor', totalBeds: 6, gender: 'Mixed' },
];

// Generate Mock Beds
const generateBeds = () => {
    const beds: Bed[] = [];
    mockWards.forEach(ward => {
        for (let i = 1; i <= ward.totalBeds; i++) {
            const statusRandom = Math.random();
            const status = statusRandom > 0.7 ? 'occupied' : statusRandom > 0.6 ? 'cleaning' : 'available';

            beds.push({
                id: `bed-${ward.id}-${i}`,
                wardId: ward.id,
                bedNumber: `${ward.name.substring(0, 3).toUpperCase()}-${i.toString().padStart(2, '0')}`,
                status: status,
                type: ward.type.toLowerCase() as any,
                pricePerDay: ward.type === 'Private' ? 5000 : ward.type === 'ICU' ? 15000 : 1000,
                // Mock patient if occupied (we'll fill details later or leave empty for now)
            });
        }
    });
    return beds;
};

export const mockBeds: Bed[] = generateBeds();
export const mockAdmissions: IPDAdmission[] = [];

// Service Functions

export async function getWards(): Promise<Ward[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockWards;
}

export async function getBeds(wardId?: string): Promise<Bed[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (wardId && wardId !== 'all') {
        return mockBeds.filter(b => b.wardId === wardId);
    }
    return mockBeds;
}

export async function admitPatient(
    patient: { id: string, name: string },
    bedId: string,
    details: { doctor: string, diagnosis: string, encounterId?: string }
): Promise<IPDAdmission> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const bed = mockBeds.find(b => b.id === bedId);
    if (!bed) throw new Error("Bed not found");
    if (bed.status !== 'available') throw new Error("Bed is not available");

    const admission: IPDAdmission = {
        id: `adm-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        encounterId: details.encounterId,
        bedId: bed.id,
        wardId: bed.wardId,
        doctor: details.doctor,
        diagnosis: details.diagnosis,
        admittedAt: new Date().toISOString(),
        status: 'admitted'
    };

    mockAdmissions.push(admission);

    // Update Bed Status
    bed.status = 'occupied';
    bed.patientId = patient.id;
    bed.admissionId = admission.id;

    return admission;
}

export async function dischargePatient(admissionId: string): Promise<IPDAdmission> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const admission = mockAdmissions.find(a => a.id === admissionId);
    if (!admission) throw new Error("Admission not found");

    admission.status = 'discharged';
    admission.dischargedAt = new Date().toISOString();

    // Free up bed - set to cleaning
    const bed = mockBeds.find(b => b.id === admission.bedId);
    if (bed) {
        bed.status = 'cleaning';
        bed.patientId = undefined;
        bed.admissionId = undefined;
    }

    return admission;
}


export async function markBedClean(bedId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const bed = mockBeds.find(b => b.id === bedId);
    if (bed) bed.status = 'available';
}

// --- Admission Requests Logic ---

export interface AdmissionRequest {
    id: string;
    patientId: string;
    patientName: string;
    age: string;
    gender: string;
    priority: 'routine' | 'urgent' | 'emergency';
    department: string;
    doctor: string;
    diagnosis: string;
    requestedAt: string;
    status: 'pending' | 'admitted' | 'cancelled';
    notes?: string;
}

export const mockAdmissionRequests: AdmissionRequest[] = [
    {
        id: 'req-1',
        patientId: 'p1',
        patientName: 'John Doe',
        age: '35',
        gender: 'male',
        priority: 'urgent',
        department: 'Cardiology',
        doctor: 'Dr. Smith',
        diagnosis: 'Acute Chest Pain',
        requestedAt: new Date().toISOString(),
        status: 'pending'
    },
    {
        id: 'req-2',
        patientId: 'p2',
        patientName: 'Jane Smith',
        age: '28',
        gender: 'female',
        priority: 'routine',
        department: 'Orthopedics',
        doctor: 'Dr. Jones',
        diagnosis: ' ACL Tear',
        requestedAt: new Date().toISOString(),
        status: 'pending'
    }
];

export async function getAdmissionRequests(): Promise<AdmissionRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAdmissionRequests.filter(r => r.status === 'pending');
}

export async function assignBedToRequest(requestId: string, bedId: string): Promise<IPDAdmission> {
    const request = mockAdmissionRequests.find(r => r.id === requestId);
    if (!request) throw new Error("Request not found");

    // Admit patient
    const admission = await admitPatient(
        { id: request.patientId, name: request.patientName },
        bedId,
        { doctor: request.doctor, diagnosis: request.diagnosis }
    );

    // Update request
    request.status = 'admitted';

    return admission;
}


// --- Clinical Charting & Active Patients ---

export interface ClinicalNote {
    id: string;
    admissionId: string;
    note: string;
    author: string; // Doctor/Nurse
    timestamp: string;
    type: 'Progress Note' | 'Nurse Note' | 'Round';
}

export const mockClinicalNotes: ClinicalNote[] = [];

export async function getActivePatients(): Promise<IPDAdmission[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAdmissions.filter(a => a.status === 'admitted');
}

export async function getPatientChart(admissionId: string): Promise<{ admission: IPDAdmission, notes: ClinicalNote[], bed: Bed }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const admission = mockAdmissions.find(a => a.id === admissionId);
    if (!admission) throw new Error("Admission not found");

    const bed = mockBeds.find(b => b.id === admission.bedId);
    if (!bed) throw new Error("Bed context missing");

    const notes = mockClinicalNotes.filter(n => n.admissionId === admissionId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { admission, notes, bed };
}

export async function addClinicalNote(note: Omit<ClinicalNote, 'id' | 'timestamp'>): Promise<ClinicalNote> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newNote: ClinicalNote = {
        ...note,
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString()
    };
    mockClinicalNotes.unshift(newNote); // newest first
    return newNote;
}

// --- Billing & Discharge ---

export interface DischargeSummary {
    admissionId: string;
    patientName: string;
    admissionDate: string;
    dischargeDate: string;
    totalDays: number;
    bedChargePerDay: number;
    totalBedCharges: number;
    otherCharges: number;
    totalAmount: number;
}

export async function calculateDischargeSummary(admissionId: string): Promise<DischargeSummary> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const admission = mockAdmissions.find(a => a.id === admissionId);
    if (!admission) throw new Error("Admission not found");

    const bed = mockBeds.find(b => b.id === admission.bedId);
    if (!bed) throw new Error("Bed info missing"); // Should exist even if patient discharged, but for active logic it works. 
    // Careful: if already discharged, bed might be freed. THIS function implies pre-discharge status.

    const admissionDate = new Date(admission.admittedAt);
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - admissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

    const totalBedCharges = diffDays * bed.pricePerDay;
    const otherCharges = 1500; // Mock nursing/service charges

    return {
        admissionId: admission.id,
        patientName: admission.patientName,
        admissionDate: admission.admittedAt,
        dischargeDate: now.toISOString(),
        totalDays: diffDays,
        bedChargePerDay: bed.pricePerDay,
        totalBedCharges,
        otherCharges,
        totalAmount: totalBedCharges + otherCharges
    };
}

export async function finalizeDischarge(admissionId: string): Promise<Invoice> {
    // 1. Calculate final bill
    const summary = await calculateDischargeSummary(admissionId);

    // 2. Discharge patient
    await dischargePatient(admissionId);

    // 3. Generate Invoice
    const invoice: Invoice = {
        id: `inv-ipd-${Date.now()}`,
        encounterId: admissionId, // Using admission ID as encounter ID context
        patientId: mockAdmissions.find(a => a.id === admissionId)?.patientId || "",
        billType: 'Registration', // Should be 'IPD' but reusing enum. Can force cast or add 'IPD' to enum in opdService later.
        amount: summary.totalAmount,
        status: 'pending',
        generatedAt: new Date().toISOString()
    };

    // Cast billType to any to support "IPD" if strictly logical, or just map to 'Consultation' for now as placeholder
    (invoice as any).billType = 'IPD Bill';

    invoices.push(invoice);
    return invoice;
}
