export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    timeOfDay: Date[];
    image?: string;
    notes?: string;
}