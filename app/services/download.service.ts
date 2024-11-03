import { Observable } from '@nativescript/core';
import { Background } from '@nativescript/background-http';

export class DownloadService extends Observable {
    private static instance: DownloadService;
    private activeDownloads: Map<string, any> = new Map();

    static getInstance(): DownloadService {
        if (!DownloadService.instance) {
            DownloadService.instance = new DownloadService();
        }
        return DownloadService.instance;
    }

    async startDownload(track: any) {
        const session = Background.session('download');
        const request = {
            url: track.downloadUrl,
            description: `Downloading ${track.title}`,
            androidAutoCancel: false,
            androidNotificationChannel: 'downloads'
        };

        const task = session.downloadFile(request);
        
        this.activeDownloads.set(track.id, {
            task,
            track,
            progress: 0
        });

        task.on('progress', (e) => {
            const progress = e.currentBytes / e.totalBytes;
            this.updateDownloadProgress(track.id, progress);
        });

        task.on('complete', () => {
            this.completeDownload(track.id);
        });

        task.on('error', (error) => {
            console.error('Download error:', error);
            this.activeDownloads.delete(track.id);
        });
    }

    private updateDownloadProgress(trackId: string, progress: number) {
        const download = this.activeDownloads.get(trackId);
        if (download) {
            download.progress = progress;
            this.notifyPropertyChange('activeDownloads', this.activeDownloads);
        }
    }

    private completeDownload(trackId: string) {
        this.activeDownloads.delete(trackId);
        this.notifyPropertyChange('activeDownloads', this.activeDownloads);
    }

    cancelDownload(trackId: string) {
        const download = this.activeDownloads.get(trackId);
        if (download) {
            download.task.cancel();
            this.activeDownloads.delete(trackId);
            this.notifyPropertyChange('activeDownloads', this.activeDownloads);
        }
    }
}