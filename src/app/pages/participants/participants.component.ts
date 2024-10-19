import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { RouterLink } from '@angular/router';
import { AddParticipantComponent } from '../../shared/add-participant/add-participant.component';
import { participant } from '../../core/models/participant';

@Component({
    selector: 'app-participants',
    standalone: true,
    imports: [AddParticipantComponent, FormsModule, MessageBoxComponent, ReactiveFormsModule, RouterLink],
    templateUrl: './participants.component.html',
    styleUrl: './participants.component.css'
})
export class ParticipantsComponent {

    @ViewChild(AddParticipantComponent) AddParticipantComponent!: AddParticipantComponent;

    editParticipant!: participant;
    loadingData: boolean = false;
    participants: any;
    participantForm = new FormGroup({
        arrival: new FormControl<Date | ''>(''),
        departure: new FormControl<Date | ''>(''),
        id: new FormControl(''),
        name: new FormControl(''),
        things: new FormControl(''),
    });

    constructor(
        private tourService: TourService,
    ) {}

    ngOnInit() {
        this.getParticipants();
    }

    getParticipants() {
        this.loadingData = true;
        this.tourService.get('participants')
        .toPromise()
        .then((response) => {
            this.participants = response.participants;
            this.loadingData = false;
            console.log('getParticipants - success', this.participants);
        })
        .catch((error) => {
            this.loadingData = false;
            console.error('getParticipants - error', error);
        });
    }

    deleteParticipant(participantID: string) {
        this.tourService.delete('participants/' + participantID)
        .toPromise()
        .then((response) => {
            this.participants = response;
            this.getParticipants()
            console.log('Add participant - success', this.participants);
        })
        .catch((error) => {
            console.error('Add participant - error', error);
        });
    }
}
