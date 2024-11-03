import { ApplicationSettings } from '@nativescript/core';

export function checkFirstLaunch(): boolean {
    const hasLaunched = ApplicationSettings.getBoolean('has_launched', false);
    if (!hasLaunched) {
        ApplicationSettings.setBoolean('has_launched', true);
        return true;
    }
    return false;
}

export function getStorageUsage(): number {
    return ApplicationSettings.getNumber('storage_usage', 0);
}

export function updateStorageUsage(bytes: number): void {
    ApplicationSettings.setNumber('storage_usage', bytes);
}