import { firebase } from '@nativescript/firebase-core';
import { GoogleSignin } from '@nativescript/google-signin';
import { Observable } from '@nativescript/core';

export class AuthService extends Observable {
    private static instance: AuthService;
    public user: any = null;

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async googleSignIn() {
        try {
            await GoogleSignin.configure({
                // Add your Google Sign-in config
            });
            const { idToken } = await GoogleSignin.signIn();
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
            return firebase.auth().signInWithCredential(credential);
        } catch (error) {
            console.error('Google Sign-in error:', error);
            throw error;
        }
    }

    async emailSignUp(email: string, password: string) {
        try {
            return await firebase.auth().createUserWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Email sign-up error:', error);
            throw error;
        }
    }

    async emailSignIn(email: string, password: string) {
        try {
            return await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Email sign-in error:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
            if (await GoogleSignin.isSignedIn()) {
                await GoogleSignin.signOut();
            }
        } catch (error) {
            console.error('Sign-out error:', error);
            throw error;
        }
    }
}