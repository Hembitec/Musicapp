import { Observable } from '@nativescript/core';
import { DownloadService } from '../../services/download.service';

export class DownloadsViewModel extends Observable {
    private downloadService: DownloadService;
    public downloads: any[] = [];
    public storageUsage: string = '0 MB';
    public queueCount: number = 0;

    constructor() {
        super();
        this.downloadService = DownloadService.getInstance();
        this.setupDownloadBindings();
        this.updateStorageUsage();
    }

    private setupDownloadBindings() {
        this.downloadService.on('downloadsChanged', () => {
            this.refreshDownloads();
        });
    }

    private refreshDownloads() {
        // Convert Map to array for the ListView
        this.downloads = Array.from(this.downloadService.activeDownloads.values());
        this.notifyPropertyChange('downloads', this.downloads);
        
        this.queueCount = this.downloads.filter(d => d.status === 'queued').length;
        this.notifyPropertyChange('queueCount', this.queueCount);
    }

    private updateStorageUsage() {
        const usage = this.downloadService.getStorageUsage();
        this.storageUsage = `${(usage / (1024 * 1024)).toFixed(1)} MB`;
        this.notifyPropertyChange('storageUsage', this.storageUsage);
    }

    onCancelTap(args: any) {
        const download = this.downloads[args.index];
        this.downloadService.cancelDownload(download.track.id);
    }

    onClearCompleted() {
        this.downloadService.clearCompleted();
        this.refreshDownloads();
    }
}