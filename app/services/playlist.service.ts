import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';
import { AuthService } from './auth.service';

export class PlaylistService extends Observable {
    private static instance: PlaylistService;
    private authService: AuthService;
    private db: any;

    static getInstance(): PlaylistService {
        if (!PlaylistService.instance) {
            PlaylistService.instance = new PlaylistService();
        }
        return PlaylistService.instance;
    }

    constructor() {
        super();
        this.authService = AuthService.getInstance();
        this.db = firebase.firestore();
    }

    async createPlaylist(name: string, description: string = '') {
        try {
            const userId = this.authService.user?.uid;
            const playlist = {
                name,
                description,
                userId,
                tracks: [],
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await this.db.collection('playlists').add(playlist);
        } catch (error) {
            console.error('Create playlist error:', error);
            throw error;
        }
    }

    async getUserPlaylists() {
        try {
            const userId = this.authService.user?.uid;
            const snapshot = await this.db.collection('playlists')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Get playlists error:', error);
            throw error;
        }
    }

    async addTrackToPlaylist(playlistId: string, track: any) {
        try {
            await this.db.collection('playlists').doc(playlistId).update({
                tracks: firebase.firestore.FieldValue.arrayUnion(track),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Add track error:', error);
            throw error;
        }
    }

    async removeTrackFromPlaylist(playlistId: string, track: any) {
        try {
            await this.db.collection('playlists').doc(playlistId).update({
                tracks: firebase.firestore.FieldValue.arrayRemove(track),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Remove track error:', error);
            throw error;
        }
    }

    async deletePlaylist(playlistId: string) {
        try {
            await this.db.collection('playlists').doc(playlistId).delete();
        } catch (error) {
            console.error('Delete playlist error:', error);
            throw error;
        }
    }
}