import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, TemplateRef, } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { debounceTime, map } from 'rxjs/operators';
import { Observable, OperatorFunction } from 'rxjs';

import { TourService } from '../../core/services/tour.service';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';

@Component({
    selector: 'app-add-tour',
    standalone: true,
    imports: [CommonModule, DatePickerComponent, FormsModule, NgbTypeaheadModule, ReactiveFormsModule, RouterLink],
    templateUrl: './add-tour.component.html',
    styleUrl: './add-tour.component.css'
})
export class AddTourComponent {

    @Input() icon!: string;
    @Input() tour!: any
    @Input() tourID!: number;
    @Output() loadData = new EventEmitter()

	closeResult = '';
    newParticipants: Array<any> = [];
    participantsMap: Array<any> = [];

    tourForm = new FormGroup({
        destination: new FormControl(''),
        name: new FormControl('', Validators.required),
        start: new FormControl('', Validators.required),
        end: new FormControl('', Validators.required),
    });

    private modalService = inject(NgbModal);

    constructor(
        private tourService: TourService
    ) {}

    ngOnInit() {
        this.getParticipants()
        if ( this.tour ){ 
            this.tourForm.setValue({
                destination: this.tour.tourData.destination,
                name: this.tour.tourData.name,
                start: this.tour.tourData.start,
                end: this.tour.tourData.end
            })
        }
    }

    addParticipant(participant: any){
        const index = this.newParticipants.indexOf(participant);
        if (index === -1) {
        console.log("index",index)
            let newParticipantObject: any = {};
            newParticipantObject = {
                id: participant.item.id,
                start: this.tourForm.get('start')!.value,
                end: this.tourForm.get('end')!.value,
            };
            this.newParticipants.push(newParticipantObject);
            console.log(this.newParticipants)
        }
    }

    getParticipants() {
        this.tourService.get('participants')
        .toPromise()
        .then((response) => {
            //this.participantsMap = response.participants;
            // console.log('getParticipants - success', this.participantsMap);
            for (var i = 0; i < response.participants.length; i++) {
                var id = response.participants[i].id;
                this.participantsMap[id] = response.participants[i];
            }
            // console.log("participantsMap", this.participantsMap)

        })
        .catch((error) => {
            console.error('getParticipants - error', error);
        });
    }

    getParticipantName = (x: { id: string }) => x.id;

    getParticipantID = (x: { name: string }) => x.name;

    editTour() {

        const data = {
            tourCars: JSON.stringify(this.tour.tourCars),
            tourData: JSON.stringify(this.tourForm.value),
            tourThings: JSON.stringify(this.tour.tourThings),
            tourParticipants: JSON.stringify(this.tour.tourParticipants),
        };
        this.tourService.put('tour/' + this.tourID, data)
        .toPromise()
        .then((response) => {
            this.loadData.emit()
            console.log('editTour - success', response);
        })
        .catch((error) => {
            console.error('editTour - error', error);
        });
    }

    newTour() {
        const data = {
            tourCars: JSON.stringify([]),
            tourData: JSON.stringify(this.tourForm.value),
            tourThings: JSON.stringify([]),
            tourParticipants: JSON.stringify(this.newParticipants),
        };
        this.tourService.post('tours', data)
        .toPromise()
        .then((response) => {
            this.loadData.emit()
            console.log('newTour - success', response);
        })
        .catch((error) => {
            console.error('newTour - error', error);
        });
    }

    open(tourModal: TemplateRef<any>) {
		this.modalService.open(tourModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			}
		);
	}

    removeParticipant(participantID: any) {
        const index = this.newParticipants.indexOf(participantID);
        if (index !== -1) {
            this.newParticipants.splice(index, 1);
        }
        console.log(this.newParticipants)

    }

    searchParticipants: OperatorFunction<string, readonly { name: string }[]> = (text$:  Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        map((term) =>
            term === ''
                ? []
                : this.participantsMap.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
        ),
    );

}
