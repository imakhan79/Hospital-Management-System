
export interface OperationTheater {
    id: string;
    name: string;
    type: 'General' | 'Cardiac' | 'Neuro' | 'Ortho';
    status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
}

export interface SurgeryBooking {
    id: string;
    patientId: string;
    patientName: string;
    surgeryName: string;
    surgeon: string;
    anaesthetist?: string;
    scheduledAt: string; // ISO string
    durationMinutes: number;
    otId: string;
    status: 'scheduled' | 'pre-op' | 'in-surgery' | 'recovery' | 'completed' | 'cancelled';
    priority: 'routine' | 'urgent' | 'emergency';
    notes?: string;
}

export interface SurgeryNote {
    id: string;
    bookingId: string;
    surgeon: string;
    procedurePerformed: string;
    findings: string;
    outcome: string;
    postOpOrders: string;
    timestamp: string;
}

export const mockOTs: OperationTheater[] = [
    { id: 'ot-1', name: 'OT-1 (Main)', type: 'General', status: 'available' },
    { id: 'ot-2', name: 'OT-2 (Cardiac)', type: 'Cardiac', status: 'occupied' },
    { id: 'ot-3', name: 'OT-3 (Minor)', type: 'General', status: 'maintenance' },
];

export const mockSurgeryBookings: SurgeryBooking[] = [
    {
        id: 'sb-1',
        patientId: 'p-1',
        patientName: 'John Doe',
        surgeryName: 'Appendectomy',
        surgeon: 'Dr. Smith',
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        durationMinutes: 60,
        otId: 'ot-1',
        status: 'scheduled',
        priority: 'urgent'
    }
];

export const mockSurgeons = [
    { id: 'dr-1', name: 'Dr. Sarah Johnson', specialty: 'General Surgery' },
    { id: 'dr-2', name: 'Dr. Michael Chen', specialty: 'Cardiology' },
    { id: 'dr-3', name: 'Dr. Emily Wilson', specialty: 'Orthopedics' },
    { id: 'dr-4', name: 'Dr. David Lee', specialty: 'Neurosurgery' },
];

export const mockSurgeryNotes: SurgeryNote[] = [];

// Service Functions
export async function getOTs(): Promise<OperationTheater[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOTs;
}

export async function getSurgeryBookings(): Promise<SurgeryBooking[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSurgeryBookings.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
}

export async function bookSurgery(booking: Omit<SurgeryBooking, 'id' | 'status'>): Promise<SurgeryBooking> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newBooking: SurgeryBooking = {
        ...booking,
        id: `sb-${Date.now()}`,
        status: 'scheduled'
    };
    mockSurgeryBookings.push(newBooking);
    return newBooking;
}

export async function updateSurgeryStatus(id: string, status: SurgeryBooking['status']): Promise<SurgeryBooking> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const booking = mockSurgeryBookings.find(b => b.id === id);
    if (!booking) throw new Error("Booking not found");
    booking.status = status;

    // Update OT status based on surgery status
    const ot = mockOTs.find(o => o.id === booking.otId);
    if (ot) {
        if (status === 'in-surgery') ot.status = 'occupied';
        if (status === 'completed' || status === 'cancelled') ot.status = 'cleaning';
    }

    return booking;
}

export async function deleteSurgery(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockSurgeryBookings.findIndex(b => b.id === id);
    if (index !== -1) {
        mockSurgeryBookings.splice(index, 1);
    }
}

export async function addSurgeryNote(note: Omit<SurgeryNote, 'id' | 'timestamp'>): Promise<SurgeryNote> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newNote: SurgeryNote = {
        ...note,
        id: `sn-${Date.now()}`,
        timestamp: new Date().toISOString()
    };
    mockSurgeryNotes.push(newNote);
    return newNote;
}

export async function getSurgeryNote(bookingId: string): Promise<SurgeryNote | undefined> {
    return mockSurgeryNotes.find(n => n.bookingId === bookingId);
}
