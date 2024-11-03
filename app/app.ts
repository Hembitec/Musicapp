import { Application } from '@nativescript/core';
import { initializeFirebase } from './services/firebase.service';
import { checkFirstLaunch } from './services/storage.service';

// Initialize Firebase before app start
initializeFirebase();

// Check if it's first launch to show onboarding
const startPage = checkFirstLaunch() ? 'pages/onboarding/onboarding-page' : 'pages/auth/login-page';

Application.run({ moduleName: startPage });