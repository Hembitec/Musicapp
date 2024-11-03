import { Observable, Frame } from '@nativescript/core';
import { SpeechRecognition } from 'nativescript-speech-recognition';
import { SearchService } from '../../services/search.service';
import { DownloadService } from '../../services/download.service';

export class SearchViewModel extends Observable {
    private searchService: SearchService;
    private downloadService: DownloadService;
    private speechRecognition: SpeechRecognition;

    public searchQuery: string = '';
    public searchResults: any[] = [];
    public isSearching: boolean = false;

    constructor() {
        super();
        this.searchService = SearchService.getInstance();
        this.downloadService = DownloadService.getInstance();
        this.speechRecognition = new SpeechRecognition();
    }

    async onSearch() {
        if (!this.searchQuery.trim()) return;

        this.isSearching = true;
        this.notifyPropertyChange('isSearching', true);

        try {
            const results = await this.searchService.search(this.searchQuery);
            this.searchResults = results;
            this.notifyPropertyChange('searchResults', results);
        } catch (error) {
            console.error('Search error:', error);
            // Handle error appropriately
        } finally {
            this.isSearching = false;
            this.notifyPropertyChange('isSearching', false);
        }
    }

    async onVoiceSearch() {
        try {
            const available = await this.speechRecognition.available();
            if (available) {
                const result = await this.speechRecognition.startListening({
                    locale: "en-US",
                    onResult: (transcription) => {
                        this.searchQuery = transcription.text;
                        this.notifyPropertyChange('searchQuery', this.searchQuery);
                        this.onSearch();
                    }
                });
            }
        } catch (error) {
            console.error('Voice search error:', error);
            // Handle error appropriately
        }
    }

    onDownloadTap(args: any) {
        const track = this.searchResults[args.index];
        this.downloadService.startDownload(track);
        Frame.topmost().navigate({
            moduleName: 'pages/downloads/downloads-page',
            animated: true
        });
    }
}