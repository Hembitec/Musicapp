import { Observable, Frame, ApplicationSettings } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { DownloadService } from '../../services/download.service';

export class SettingsViewModel extends Observable {
    private authService: AuthService;
    private downloadService: DownloadService;

    public userEmail: string = '';
    public storageUsage: string = '0 MB';
    public qualities: string[] = ['Low', 'Medium', 'High'];
    public selectedQualityIndex: number = 1;
    public selectedDownloadQualityIndex: number = 1;
    public downloadNotifications: boolean = true;

    constructor() {
        super();
        this.authService = AuthService.getInstance();
        this.downloadService = DownloadService.getInstance();
        this.loadSettings();
    }

    private loadSettings() {
        this.userEmail = this.authService.user?.email || '';
        this.storageUsage = this.formatStorageUsage(this.downloadService.getStorageUsage());
        
        this.selectedQualityIndex = ApplicationSettings.getNumber('stream_quality', 1);
        this.selectedDownloadQualityIndex = ApplicationSettings.getNumber('download_quality', 1);
        this.downloadNotifications = ApplicationSettings.getBoolean('download_notifications', true);
    }

    private formatStorageUsage(bytes: number): string {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    }

    async onSignOutTap() {
        try {
            await this.authService.signOut();
            Frame.topmost().navigate({
                moduleName: 'pages/auth/login-page',
                clearHistory: true
            });
        } catch (error) {
            console.error('Sign out error:', error);
            // Handle error appropriately
        }
    }

    async onClearCacheTap() {
        try {
            await this.downloadService.clearCache();
            this.storageUsage = this.formatStorageUsage(this.downloadService.getStorageUsage());
            this.notifyPropertyChange('storageUsage', this.storageUsage);
        } catch (error) {
            console.error('Clear cache error:', error);
            // Handle error appropriately
        }
    }

    onTermsTap() {
        // Navigate to Terms of Service page
    }

    onPrivacyTap() {
        // Navigate to Privacy Policy page
    }
}