import { MTS_PROTOCOLS, MTSDiscriminator, TRIAGE_LEVELS, TriageLevel } from "@/data/mts-protocols";

export interface VitalSigns {
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    systolicBP?: number;
    painScale?: number;
    consciousness?: 'alert' | 'verbal' | 'pain' | 'unresponsive';
}

export function calculateTriageLevel(
    complaintId: string,
    selectedDiscriminatorIds: string[],
    vitals: VitalSigns
): { level: TriageLevel; reason: string } {
    let highestSeverity: TriageLevel = 5; // Default to Non-Urgent (Blue)
    let reason = "Standard assessment";

    // 1. Check Vital Signs (Red Flags)
    if (vitals.oxygenSaturation && vitals.oxygenSaturation < 90) {
        if (highestSeverity > 1) { // 1 is highest priority (lower number)
            // If we are currently 2, 3, 4, 5 -> switch to 2 (Orange) - wait, SpO2 < 90 is usually Orange/Red
            // Let's allow vitals to override.
            // Usually SpO2 < 90 is Very Urgent (Orange) or Immediate (Red) depending on distress.
            // We act conservatively: Level 2 (Orange)
            if (highestSeverity > 2) {
                highestSeverity = 2;
                reason = "Critical Vital Sign: Low SpO2";
            }
        }
    }

    if (vitals.consciousness === 'unresponsive') {
        highestSeverity = 1;
        reason = "Critical: Unresponsive patient";
        return { level: 1, reason };
    }

    if (vitals.consciousness === 'pain' || vitals.consciousness === 'verbal') {
        if (highestSeverity > 2) {
            highestSeverity = 2;
            reason = "Altered Consciousness Level";
        }
    }

    // 2. Check Discriminators via Protocol
    const complaint = MTS_PROTOCOLS.find(c => c.id === complaintId);
    if (complaint && selectedDiscriminatorIds.length > 0) {
        const relevantDiscriminators = complaint.discriminators.filter(d => selectedDiscriminatorIds.includes(d.id));

        // Find the discriminator with the lowest level number (Highest Priority)
        // e.g. if we have Level 2 and Level 3 selected, Level 2 wins.

        for (const d of relevantDiscriminators) {
            if (d.level < highestSeverity) {
                highestSeverity = d.level;
                reason = `Discriminator: ${d.description}`;
            }
        }
    }

    return { level: highestSeverity, reason };
}

export function getTriageColor(level: TriageLevel): string {
    return TRIAGE_LEVELS[level].color; // red, orange, yellow, green, blue
}

export function getTriageLabel(level: TriageLevel): string {
    return TRIAGE_LEVELS[level].name;
}

export function getTriageSLA(level: TriageLevel): number {
    return TRIAGE_LEVELS[level].sla;
}
