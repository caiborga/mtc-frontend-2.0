import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgModel, Validators } from '@angular/forms';
import { NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';

import { Router, RouterLink } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { AuthService } from '../../core/services/auth-service.service';
import { AddTourComponent } from '../../shared/add-tour/add-tour.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [AddTourComponent, CommonModule, FormsModule, NgbDropdownModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

    groupIdFromLink: string = '';
    groupIdFromStorage: string | null = '';
    loadingData: boolean = false;
    newThings: Array<any> = [];
    tours: Array<any> = [];

    // @ViewChild('input') inputField: NgModel | null = null;
    @ViewChild('input') inputField!: NgModel;

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private localStorageService: LocalStorageService,
        private tourService: TourService
    ) {}

    private sub: any;

    async ngOnInit() {
        this.loadingData = true;
        let groupIsValid = false;
    
        // Get group ID from route params
        this.sub = this.route.params.subscribe(params => {
            this.groupIdFromLink = params['id'];
        });
    
        // Get group ID from storage
        this.groupIdFromStorage = this.localStorageService.getItem('key');
    
        // Validate group ID
        if (this.groupIdFromLink || this.groupIdFromStorage) {
            if (this.groupIdFromLink) {
                groupIsValid = await this.groupIsValid(this.groupIdFromLink);
                if (groupIsValid) {
                    // Set group ID in storage if valid
                    this.localStorageService.setItem('key', this.groupIdFromLink);
                    this.authService.login();
                }
            } else if (this.groupIdFromStorage) {
                groupIsValid = await this.groupIsValid(this.groupIdFromStorage);
                if (groupIsValid) {
                    this.authService.login();
                }
            }
        }
    
        // Redirect and logout if group is not valid
        if (!groupIsValid) {
            this.router.navigate(['/', 'register']);
            this.authService.logout();
            return;
        }
    
        // Proceed with other actions if group is valid
        this.getTours();
    }

    async groupIsValid(groupId: string): Promise<boolean> {
        try {
            const response = await this.tourService.get('group/' + groupId).toPromise();
            console.log('groupIsValid - success:', response);
            return response.existing;
        } catch (error) {
            console.log('groupIsValid - error:', error);
            return false;
        }
    }

    getTours(){
        this.loadingData = true;
        this.tourService.get('tours')
        .toPromise()
        .then((response) => {
            this.tours = response.tours;
            // console.log('getTours - success:', this.tours);
            for (let tour in this.tours) {
                let participants = JSON.parse(this.tours[tour].tour_participants)
                let tourData = JSON.parse(this.tours[tour].tour_data)
                this.tours[tour].participants = participants
                this.tours[tour].tourData = tourData
            }
            this.loadingData = false;
            console.log('getTours - success:', this.tours);
            
        })
        .catch((error) => {
            this.loadingData = false;
            console.error('getTours - error:', error);
        });
    }

    deleteTour(tourID: string) {
        this.tourService.delete('tours/' + tourID)
        .toPromise()
        .then((response) => {
            this.getTours()
            console.log('Delete tour - success', response);
        })
        .catch((error) => {
            console.error('Delete tour - error', error);
        });
    }
}
