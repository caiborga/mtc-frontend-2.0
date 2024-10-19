import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { AuthService } from '../../core/services/auth-service.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { backendUrl } from '../../../../environment';

import { Message, MessageBoxComponent } from '../../shared/message-box/message-box.component';


interface Response {
    message: string,
    key: string
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, MessageBoxComponent],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {

    @ViewChild(MessageBoxComponent) messageBox!: MessageBoxComponent

    name: string = ''
    link: string = ''

    constructor(
        private authService: AuthService,
        private clipboard: Clipboard,
        private router: Router,
        private tourService: TourService,
        private localStorage: LocalStorageService
    ) {}

    copyToClipboard() {
        let message: Message = {
            type: 'info',
            message: `Link wurde in die Zwischenablage kopiert!`
        }
        this.clipboard.copy(this.link);
        this.messageBox.changeSuccessMessage(message);

    }

    registerGroup() {
        let data = { 
            name: this.name
        }
        this.tourService.post('register', data)
        .toPromise()
        .then((response: any) => {
            console.log('registerGroup - success', response.message);
            this.authService.login()
            this.localStorage.setItem('key', response.key)
            this.link = `https://caiborga.github.io/mtc-frontend/browser/#/home/${response.key}/`
        })
        .catch((error) => {
            console.error('registerGroup - error', error);
        });
    }
}
