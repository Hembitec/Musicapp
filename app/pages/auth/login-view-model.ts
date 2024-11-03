import { Observable, Frame } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';

export class LoginViewModel extends Observable {
    private authService: AuthService;
    public email: string = '';
    public password: string = '';

    constructor() {
        super();
        this.authService = AuthService.getInstance();
    }

    async onGoogleSignIn() {
        try {
            await this.authService.googleSignIn();
            this.navigateToHome();
        } catch (error) {
            console.error('Google sign-in error:', error);
            // Handle error appropriately
        }
    }

    async onEmailSignIn() {
        try {
            await this.authService.emailSignIn(this.email, this.password);
            this.navigateToHome();
        } catch (error) {
            console.error('Email sign-in error:', error);
            // Handle error appropriately
        }
    }

    async onEmailSignUp() {
        try {
            await this.authService.emailSignUp(this.email, this.password);
            this.navigateToHome();
        } catch (error) {
            console.error('Email sign-up error:', error);
            // Handle error appropriately
        }
    }

    private navigateToHome() {
        Frame.topmost().navigate({
            moduleName: 'pages/home/home-page',
            clearHistory: true
        });
    }
}