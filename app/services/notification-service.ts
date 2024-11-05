import { LocalNotifications } from '@nativescript/local-notifications';
import { Medication } from '../models/medication';

export class NotificationService {
    async scheduleNotification(medication: Medication) {
        const notifications = medication.timeOfDay.map((time, index) => ({
            id: parseInt(medication.id + index),
            title: 'Medication Reminder',
            body: `Time to take ${medication.name} - ${medication.dosage}`,
            scheduled: true,
            at: time
        }));

        await LocalNotifications.schedule(notifications);
    }

    async cancelNotification(medicationId: string) {
        await LocalNotifications.cancel(parseInt(medicationId));
    }
}