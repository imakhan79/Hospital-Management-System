export type WorkflowStation =
    | 'registration'
    | 'vitals'
    | 'doctor'
    | 'pharmacy'
    | 'lab'
    | 'billing'
    | 'exit';

export type PatientStatus =
    | 'registered'
    | 'waiting_vitals'
    | 'in_vitals'
    | 'waiting_doctor'
    | 'in_consultation'
    | 'waiting_pharmacy'
    | 'waiting_lab'
    | 'completed';

export interface QueueEntry {
    id: string;
    patientId: string;
    patientName: string;
    mrNumber: string;
    encounterId: string;
    station: WorkflowStation;
    status: 'waiting' | 'in_progress' | 'completed' | 'hold' | 'no_show';
    priority: 'routine' | 'urgent' | 'emergency';
    checkInTime: string; // ISO string
    startTime?: string; // When station processing started
    assignedTo?: string; // User ID
    notes?: string;
    waitTime?: number; // Calculated in minutes
}

export interface WorkflowTransition {
    from: WorkflowStation;
    to: WorkflowStation;
    label: string;
    action: string;
}

export const WORKFLOW_STAGES: Record<WorkflowStation, string> = {
    registration: 'Registration',
    vitals: 'Vitals Station',
    doctor: 'Doctor Consultation',
    pharmacy: 'Pharmacy',
    lab: 'Laboratory',
    billing: 'Billing',
    exit: 'Discharged/Exit'
};
