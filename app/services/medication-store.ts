import { Observable } from '@nativescript/core';
import { Medication } from '../models/medication';

export class MedicationStore extends Observable {
    private medications: Map<string, Medication> = new Map();

    addMedication(medication: Medication) {
        this.medications.set(medication.id, medication);
        this.notifyPropertyChange('medications', this.getMedications());
    }

    getMedications(): Medication[] {
        return Array.from(this.medications.values());
    }

    getMedication(id: string): Medication | undefined {
        return this.medications.get(id);
    }

    deleteMedication(id: string) {
        this.medications.delete(id);
        this.notifyPropertyChange('medications', this.getMedications());
    }
}