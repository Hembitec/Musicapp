import { Observable } from '@nativescript/core';
import { TNSPlayer } from 'nativescript-audio';

export class PlayerService extends Observable {
    private static instance: PlayerService;
    private player: TNSPlayer;
    private _isPlaying: boolean = false;
    private _currentTrack: any = null;
    private queue: any[] = [];

    static getInstance(): PlayerService {
        if (!PlayerService.instance) {
            PlayerService.instance = new PlayerService();
        }
        return PlayerService.instance;
    }

    constructor() {
        super();
        this.player = new TNSPlayer();
        this.player.debug = false;
    }

    async playTrack(track: any) {
        try {
            await this.player.initFromUrl({
                audioFile: track.url,
                loop: false,
                completeCallback: () => this.onTrackComplete(),
                errorCallback: (error) => console.error('Playback error:', error)
            });
            this._currentTrack = track;
            this._isPlaying = true;
            this.notifyPropertyChange('isPlaying', true);
            await this.player.play();
        } catch (error) {
            console.error('Play track error:', error);
            throw error;
        }
    }

    async pause() {
        try {
            await this.player.pause();
            this._isPlaying = false;
            this.notifyPropertyChange('isPlaying', false);
        } catch (error) {
            console.error('Pause error:', error);
            throw error;
        }
    }

    private onTrackComplete() {
        if (this.queue.length > 0) {
            const nextTrack = this.queue.shift();
            this.playTrack(nextTrack);
        }
    }

    addToQueue(track: any) {
        this.queue.push(track);
    }

    clearQueue() {
        this.queue = [];
    }
}