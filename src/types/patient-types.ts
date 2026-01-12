export type IdentificationType = 'CNIC' | 'Passport' | 'DrivingLicense' | 'None';
export type PatientGender = 'Male' | 'Female' | 'Other' | 'Unknown';
export type PatientMaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';
export type PatientStatus = 'active' | 'merged' | 'archived' | 'deceased';

export interface PatientProfile {
    id: string; // Internal UUID
    mrNumber: string; // MR-YYYY-XXXX

    // Demographics
    firstName: string;
    lastName: string;
    dob: string; // YYYY-MM-DD
    age?: number; // Calculated or Estimated
    gender: PatientGender;

    // Identification
    identificationType: IdentificationType;
    identificationNumber?: string;
    isUnknown: boolean; // True for "John Doe"

    // Contact
    phone: string;
    email?: string;
    address?: string;
    city?: string;

    // Emergency
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;

    // Metadata
    status: PatientStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DuplicateMatch {
    score: number; // 0-100 confidence
    patient: PatientProfile;
    matchReasons: string[]; // e.g. ["Phone Number Match", "Name Similarity"]
}

export interface RegistrationResult {
    success: boolean;
    patientId?: string;
    mrNumber?: string;
    encounterId?: string;
    message?: string;
}

export interface RegistrationInput extends Omit<PatientProfile, 'id' | 'mrNumber' | 'status' | 'createdAt' | 'updatedAt'> {
    visitDetails: {
        type: 'OPD' | 'ER' | 'IPD';
        department: string;
        doctor?: string;
        priority: 'routine' | 'urgent' | 'emergency';
    }
}
