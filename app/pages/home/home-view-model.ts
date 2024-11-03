import { Observable, Frame } from '@nativescript/core';
import { PlayerService } from '../../services/player.service';

export class HomeViewModel extends Observable {
    private playerService: PlayerService;
    public selectedTabIndex: number = 0;
    public isPlaying: boolean = false;
    public playbackProgress: number = 0;
    public currentTrack: any = null;
    
    public recommendedSongs: any[] = [
        {
            title: "Sample Song 1",
            artist: "Artist 1",
            albumArt: "~/images/album1.jpg"
        },
        {
            title: "Sample Song 2",
            artist: "Artist 2",
            albumArt: "~/images/album2.jpg"
        }
    ];

    public librarySongs: any[] = [];

    constructor() {
        super();
        this.playerService = PlayerService.getInstance();
        this.setupPlayerBindings();
    }

    private setupPlayerBindings() {
        this.playerService.on('playbackStateChanged', (data: any) => {
            this.isPlaying = data.isPlaying;
            this.notifyPropertyChange('isPlaying', this.isPlaying);
        });

        this.playerService.on('trackChanged', (data: any) => {
            this.currentTrack = data.track;
            this.notifyPropertyChange('currentTrack', this.currentTrack);
        });
    }

    onSearchTap() {
        Frame.topmost().navigate({
            moduleName: 'pages/search/search-page',
            animated: true
        });
    }

    onSettingsTap() {
        Frame.topmost().navigate({
            moduleName: 'pages/settings/settings-page',
            animated: true
        });
    }

    onPlaylistsTap() {
        Frame.topmost().navigate({
            moduleName: 'pages/playlists/playlists-page',
            animated: true
        });
    }

    onDownloadsTap() {
        Frame.topmost().navigate({
            moduleName: 'pages/downloads/downloads-page',
            animated: true
        });
    }

    onSongOptionsTap(args: any) {
        // Show song options menu
    }

    onPlayPauseTap() {
        if (this.isPlaying) {
            this.playerService.pause();
        } else {
            this.playerService.playTrack(this.currentTrack);
        }
    }

    onPreviousTap() {
        // Handle previous track
    }

    onNextTap() {
        // Handle next track
    }
}