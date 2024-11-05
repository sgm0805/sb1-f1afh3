import { Observable, ImageSource } from '@nativescript/core';
import { Camera } from '@nativescript/camera';
import { VoiceService } from '../../services/voice-service';
import { MedicationStore } from '../../services/medication-store';
import { NotificationService } from '../../services/notification-service';
import { Frame } from '@nativescript/core';

export class AddMedicationViewModel extends Observable {
    private voiceService: VoiceService;
    private medicationStore: MedicationStore;
    private notificationService: NotificationService;

    name: string = '';
    dosage: string = '';
    frequencies = ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];
    selectedFrequencyIndex: number = 0;
    hour: number = 9;
    minute: number = 0;
    medicineImage: ImageSource | null = null;

    constructor() {
        super();
        this.voiceService = new VoiceService();
        this.medicationStore = new MedicationStore();
        this.notificationService = new NotificationService();
    }

    async startVoiceInput() {
        try {
            const text = await this.voiceService.startVoiceRecognition();
            if (text) {
                this.name = text;
                this.notifyPropertyChange('name', this.name);
                this.voiceService.speak('Medication name recorded');
            }
        } catch (error) {
            console.error('Voice input error:', error);
        }
    }

    async scanMedicineLabel() {
        try {
            const imageAsset = await Camera.takePicture({
                saveToGallery: false,
                keepAspectRatio: true,
                width: 800,
                height: 800
            });
            
            this.medicineImage = await ImageSource.fromAsset(imageAsset);
            this.notifyPropertyChange('medicineImage', this.medicineImage);
            
            // Store the image with the medication
            this.voiceService.speak('Image captured successfully. Please enter medication details.');
        } catch (error) {
            console.error('Camera error:', error);
            this.voiceService.speak('Failed to capture image. Please try again.');
        }
    }

    async saveReminder() {
        if (!this.name || !this.dosage) {
            this.voiceService.speak('Please enter medication name and dosage');
            return;
        }

        const now = new Date();
        const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), this.hour, this.minute);

        const medication = {
            id: Date.now().toString(),
            name: this.name,
            dosage: this.dosage,
            frequency: this.frequencies[this.selectedFrequencyIndex],
            timeOfDay: [reminderTime],
            image: this.medicineImage ? this.medicineImage.toBase64String('png') : undefined
        };

        this.medicationStore.addMedication(medication);
        await this.notificationService.scheduleNotification(medication);
        
        this.voiceService.speak('Medication reminder saved successfully');
        Frame.topmost().goBack();
    }
}