import { EventData, Page } from '@nativescript/core';
import { OnboardingViewModel } from './onboarding-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new OnboardingViewModel();
}