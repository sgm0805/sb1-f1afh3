import { Observable } from '@nativescript/core';
import { MedicationStore } from './services/medication-store';
import { NotificationService } from './services/notification-service';
import { VoiceService } from './services/voice-service';
import { Frame } from '@nativescript/core';

export class MainViewModel extends Observable {
    private medicationStore: MedicationStore;
    private notificationService: NotificationService;
    private voiceService: VoiceService;

    constructor() {
        super();
        this.medicationStore = new MedicationStore();
        this.notificationService = new NotificationService();
        this.voiceService = new VoiceService();
    }

    get medications() {
        return this.medicationStore.getMedications();
    }

    onAddMedication() {
        Frame.topmost().navigate({
            moduleName: 'views/add-medication/add-medication-page'
        });
    }

    onMedicationOptions(args) {
        const medication = args.object.bindingContext;
        // Show options dialog (edit, delete, etc.)
    }
}