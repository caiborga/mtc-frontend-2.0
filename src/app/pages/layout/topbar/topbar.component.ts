// angular
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { RouterLink } from '@angular/router';

// bootstrap
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

// services
import { AuthService } from '../../../core/services/auth-service.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { TourService } from '../../../core/services/tour.service';

// models/definitions
import { Group } from '../../../core/models/group';
import { Subscription } from 'rxjs';
import { frontendUrl } from '../../../../../environment';

// components/others
import { Message, MessageBoxComponent } from '../../../shared/message-box/message-box.component';
import { slideInOutAnimation } from '../../../core/animations/fade';

@Component({
    animations: [slideInOutAnimation],
    selector: 'app-topbar',
    standalone: true,
    imports: [MessageBoxComponent, NgbCollapseModule, NgbTooltipModule, RouterLink],
    templateUrl: './topbar.component.html',
    styleUrl: './topbar.component.css',
})
export class TopbarComponent implements OnInit, OnDestroy {

    @ViewChild(MessageBoxComponent) messageBox!: MessageBoxComponent

    private authSubscription: Subscription;
    toggleNavbar = true;
    isAuthenticated: boolean = false;
    link: string = ''
    group: Group = {
        key: '',
        name: ''
    }

    constructor(
        private authService: AuthService,
        private clipboard: Clipboard,
        private localStorageService: LocalStorageService,
        private tourService: TourService
    ) {
        this.authSubscription = this.authService.isAuthenticated$.subscribe(
            isAuthenticated => {
                this.isAuthenticated = isAuthenticated;
                if (this.isAuthenticated) {
                    this.group.key = this.localStorageService.getItem('key')
                    this.getGroupName()
                }
            }
        );
    }

    ngOnInit() {
        this.group.key = this.localStorageService.getItem('key')
        if (this.group.key) {
            this.isAuthenticated = true
            this.link = `${frontendUrl}${this.group.key}/`
            this.getGroupName()
        }
    }

    ngOnDestroy() {
        this.authSubscription.unsubscribe();
    }

    copyToClipboard() {
        this.clipboard.copy(this.link);
        let message: Message = {
            type: 'info',
            message: `Link wurde in die Zwischenablage kopiert!`
        }
        this.messageBox.changeSuccessMessage(message);
    }

    getGroupName() {
        this.tourService.get('group/' + this.group.key)
            .toPromise()
            .then((response) => {
                this.group.name = response.name
                // console.log('getGroupName - success:', response);
            })
            .catch((error) => {
                console.error('getGroupName - error:', error);
            });
    }

    logout() {
        this.authService.logout()
    }
}
