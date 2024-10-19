import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth-service.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { TourService } from '../../../core/services/tour.service';

import { slideInOutAnimation } from '../../../core/animations/fade';


@Component({
    animations: [slideInOutAnimation],
    selector: 'app-footer',
    standalone: true,
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent {

    isAuthenticated: boolean = false;
    private authSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService,
        private tourService: TourService
    ) 
    {
        this.authSubscription = this.authService.isAuthenticated$.subscribe(
            isAuthenticated => {
                this.isAuthenticated = isAuthenticated;
            }
        );
    }

    ngOnInit() {
        let key = this.localStorageService.getItem('key')
        if ( key ) {
            this.isAuthenticated = true
        }
    }
}
