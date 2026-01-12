import { PatientProfile, DuplicateMatch, RegistrationInput, RegistrationResult } from "@/types/patient-types";
import { QueueEntry } from "@/types/workflow-types";

// Mock Database for development
const MOCK_DB: PatientProfile[] = [
    {
        id: "P-1001",
        mrNumber: "MR-2025-001",
        firstName: "John",
        lastName: "Doe",
        dob: "1985-04-12",
        gender: "Male",
        identificationType: "CNIC",
        identificationNumber: "42101-1234567-1",
        isUnknown: false,
        phone: "0300-1234567",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "P-1002",
        mrNumber: "MR-2025-002",
        firstName: "Jane",
        lastName: "Smith",
        dob: "1992-08-23",
        gender: "Female",
        identificationType: "Passport",
        identificationNumber: "A1234567",
        isUnknown: false,
        phone: "0321-7654321",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export const PatientService = {
    // 1. Search Logic
    async searchPatients(query: string): Promise<PatientProfile[]> {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 500));

        const q = query.toLowerCase().trim();
        if (!q) return [];

        return MOCK_DB.filter(p =>
            p.mrNumber.toLowerCase().includes(q) ||
            p.phone.includes(q) ||
            (p.firstName + " " + p.lastName).toLowerCase().includes(q) ||
            p.identificationNumber?.includes(q)
        );
    },

    // 2. Duplicate Detection
    async checkDuplicates(input: Partial<PatientProfile>): Promise<DuplicateMatch[]> {
        await new Promise(r => setTimeout(r, 300));

        const matches: DuplicateMatch[] = [];

        MOCK_DB.forEach(existing => {
            let score = 0;
            const reasons: string[] = [];

            // Exact Identity Match (Highest Confidence)
            if (input.identificationNumber && existing.identificationNumber === input.identificationNumber) {
                score += 90;
                reasons.push("Exact ID Match");
            }

            // Phone Match
            if (input.phone && existing.phone === input.phone) {
                score += 60;
                reasons.push("Exact Phone Match");
            }

            // Name Similarity (Simple Check)
            const inputName = `${input.firstName} ${input.lastName}`.toLowerCase();
            const existingName = `${existing.firstName} ${existing.lastName}`.toLowerCase();
            if (inputName === existingName) {
                score += 40;
                reasons.push("Exact Name Match");
            }

            if (score > 30) {
                matches.push({ score: Math.min(score, 100), patient: existing, matchReasons: reasons });
            }
        });

        return matches.sort((a, b) => b.score - a.score);
    },

    // 3. Registration
    async registerPatient(input: RegistrationInput): Promise<RegistrationResult> {
        await new Promise(r => setTimeout(r, 1000));

        try {
            // Generate MR
            const newMrNumber = `MR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
            const newId = `P-${Date.now()}`;

            const newPatient: PatientProfile = {
                id: newId,
                mrNumber: newMrNumber,
                ...input,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            MOCK_DB.push(newPatient);

            return {
                success: true,
                patientId: newId,
                mrNumber: newMrNumber,
                message: `Patient Registered Successfully: ${newMrNumber}`
            };

        } catch (error) {
            return { success: false, message: "Registration Failed" };
        }
    }
};
