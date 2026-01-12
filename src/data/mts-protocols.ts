export type TriageLevel = 1 | 2 | 3 | 4 | 5;

export interface MTSDiscriminator {
    id: string;
    description: string;
    level: TriageLevel;
}

export interface MTSPresentingComplaint {
    id: string;
    name: string;
    discriminators: MTSDiscriminator[];
}

export const TRIAGE_LEVELS: Record<TriageLevel, { name: string; color: string; sla: number; description: string }> = {
    1: {
        name: "Immediate",
        color: "red",
        sla: 0,
        description: "Immediate resuscitation required. Life-threatening.",
    },
    2: {
        name: "Very Urgent",
        color: "orange",
        sla: 10,
        description: "Emergency treatment required within 10 minutes.",
    },
    3: {
        name: "Urgent",
        color: "yellow",
        sla: 60,
        description: "Urgent treatment required within 60 minutes.",
    },
    4: {
        name: "Standard",
        color: "green",
        sla: 120,
        description: "Standard treatment required within 120 minutes.",
    },
    5: {
        name: "Non-Urgent",
        color: "blue",
        sla: 240,
        description: "Non-urgent treatment required within 240 minutes.",
    },
};

export const MTS_PROTOCOLS: MTSPresentingComplaint[] = [
    {
        id: "chest_pain",
        name: "Chest Pain",
        discriminators: [
            { id: "cp_1", description: "Airway compromise", level: 1 },
            { id: "cp_2", description: "Inadequate breathing", level: 1 },
            { id: "cp_3", description: "Shock", level: 1 },
            { id: "cp_4", description: "Cardiac pain", level: 2 },
            { id: "cp_5", description: "Severe pain", level: 2 },
            { id: "cp_6", description: "Pleuritic pain", level: 3 },
            { id: "cp_7", description: "Moderate pain", level: 3 },
            { id: "cp_8", description: "Recent mild injury", level: 4 },
        ],
    },
    {
        id: "abdominal_pain",
        name: "Abdominal Pain",
        discriminators: [
            { id: "ap_1", description: "Airway compromise", level: 1 },
            { id: "ap_2", description: "Shock", level: 1 },
            { id: "ap_3", description: "Severe pain", level: 2 },
            { id: "ap_4", description: "Signs of peritonitis", level: 2 },
            { id: "ap_5", description: "Moderate pain", level: 3 },
            { id: "ap_6", description: "Vomiting", level: 3 },
            { id: "ap_7", description: "Recent mild problem & < 7 days", level: 4 },
        ],
    },
    {
        id: "head_injury",
        name: "Head Injury",
        discriminators: [
            { id: "hi_1", description: "Airway compromise", level: 1 },
            { id: "hi_2", description: "Unresponsive (GCS < 9)", level: 1 },
            { id: "hi_3", description: "Altered consciousness", level: 2 },
            { id: "hi_4", description: "Severe mechanism of injury", level: 2 },
            { id: "hi_5", description: "History of unconsciousness", level: 3 },
            { id: "hi_6", description: "Severe headache", level: 3 },
            { id: "hi_7", description: "Scalp laceration", level: 4 },
            { id: "hi_8", description: "No neurological symptoms", level: 5 },
        ],
    },
    {
        id: "shortness_of_breath",
        name: "Shortness of Breath",
        discriminators: [
            { id: "sb_1", description: "Stridor", level: 1 },
            { id: "sb_2", description: "Severe distress", level: 1 },
            { id: "sb_3", description: "Low SpO2 (< 90%)", level: 2 },
            { id: "sb_4", description: "Moderate distress", level: 2 },
            { id: "sb_5", description: "History of asthma/COPD", level: 3 },
            { id: "sb_6", description: "Mild distress", level: 3 },
            { id: "sb_7", description: "Recent onset", level: 4 },
        ],
    },
];
