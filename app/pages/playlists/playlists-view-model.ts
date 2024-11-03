import { Observable, Frame, prompt } from '@nativescript/core';
import { PlaylistService } from '../../services/playlist.service';

export class PlaylistsViewModel extends Observable {
    private playlistService: PlaylistService;
    public playlists: any[] = [];
    public isLoading: boolean = false;

    constructor() {
        super();
        this.playlistService = PlaylistService.getInstance();
        this.loadPlaylists();
    }

    async loadPlaylists() {
        this.isLoading = true;
        this.notifyPropertyChange('isLoading', true);

        try {
            this.playlists = await this.playlistService.getUserPlaylists();
            this.notifyPropertyChange('playlists', this.playlists);
        } catch (error) {
            console.error('Load playlists error:', error);
            // Handle error appropriately
        } finally {
            this.isLoading = false;
            this.notifyPropertyChange('isLoading', false);
        }
    }

    async onCreatePlaylistTap() {
        const result = await prompt({
            title: "Create Playlist",
            message: "Enter playlist name",
            okButtonText: "Create",
            cancelButtonText: "Cancel",
            inputType: "text"
        });

        if (result.result) {
            try {
                await this.playlistService.createPlaylist(result.text);
                this.loadPlaylists();
            } catch (error) {
                console.error('Create playlist error:', error);
                // Handle error appropriately
            }
        }
    }

    onPlaylistOptionsTap(args: any) {
        const playlist = this.playlists[args.index];
        // Show options menu (edit, delete, share)
    }
}