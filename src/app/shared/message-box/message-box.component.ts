import { Component, ViewChild } from '@angular/core';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

export interface Message {
	type: string,
	message: string
}

@Component({
	selector: 'app-message-box',
	standalone: true,
	imports: [NgbAlertModule],
	templateUrl: './message-box.component.html',
	styleUrl: './message-box.component.css'
})
export class MessageBoxComponent {

	messageObject:  Message = { type: '', message: ''}
	showMessageBox: boolean = false;

	@ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert = new NgbAlert;

	constructor() {}

	public changeSuccessMessage(message: Message) {
		this.messageObject = message
		this.showMessageBox = true;
		setTimeout(()=>{ 
			this.showMessageBox = false;
		}, 2000)
	}		
}
