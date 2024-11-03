import { Observable, Frame } from '@nativescript/core';
import { PermissionsService } from '../../services/permissions.service';

export class OnboardingViewModel extends Observable {
    private currentIndex = 0;
    private permissionsService: PermissionsService;

    public slides = [
        {
            title: "Welcome to Music App",
            description: "Your personal music companion for discovering and enjoying music.",
            image: "~/images/welcome.png"
        },
        {
            title: "Discover Music",
            description: "Search and discover music from multiple sources in one place.",
            image: "~/images/discover.png"
        },
        {
            title: "Download & Listen",
            description: "Download your favorite music for offline listening.",
            image: "~/images/download.png"
        },
        {
            title: "Almost Ready!",
            description: "We just need a few permissions to get you started.",
            image: "~/images/permissions.png"
        }
    ];

    constructor() {
        super();
        this.permissionsService = PermissionsService.getInstance();
    }

    get isLastSlide(): boolean {
        return this.currentIndex === this.slides.length - 1;
    }

    async onNextTap() {
        if (this.isLastSlide) {
            await this.requestPermissions();
            this.navigateToAuth();
        } else {
            this.currentIndex++;
            this.notifyPropertyChange('isLastSlide', this.isLastSlide);
        }
    }

    private async requestPermissions() {
        await this.permissionsService.requestStoragePermission();
        await this.permissionsService.requestNotificationPermission();
    }

    private navigateToAuth() {
        Frame.topmost().navigate({
            moduleName: 'pages/auth/login-page',
            clearHistory: true
        });
    }
}