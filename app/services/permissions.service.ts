import { Permissions } from 'nativescript-permissions';
import { ApplicationSettings } from '@nativescript/core';

export class PermissionsService {
    private static instance: PermissionsService;

    static getInstance(): PermissionsService {
        if (!PermissionsService.instance) {
            PermissionsService.instance = new PermissionsService();
        }
        return PermissionsService.instance;
    }

    async requestStoragePermission(): Promise<boolean> {
        try {
            const granted = await Permissions.requestPermission(
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                "Storage access is needed to save music"
            );
            ApplicationSettings.setBoolean('storage_permission', granted);
            return granted;
        } catch (error) {
            console.error('Storage permission error:', error);
            return false;
        }
    }

    async requestNotificationPermission(): Promise<boolean> {
        try {
            const granted = await Permissions.requestPermission(
                android.Manifest.permission.POST_NOTIFICATIONS,
                "Notifications are needed for download updates"
            );
            ApplicationSettings.setBoolean('notification_permission', granted);
            return granted;
        } catch (error) {
            console.error('Notification permission error:', error);
            return false;
        }
    }
}