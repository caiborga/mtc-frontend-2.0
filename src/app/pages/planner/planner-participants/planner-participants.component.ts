import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AddParticipantComponent } from '../../../shared/add-participant/add-participant.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TourService } from '../../../core/services/tour.service';
import { Thing } from '../planner-things/things.component';
import { foodUnits } from '../../../core/models/units';
import { participant } from '../../../core/models/participant';

@Component({
  selector: 'app-planner-participants',
  standalone: true,
  imports: [AddParticipantComponent, NgbAccordionModule, NgbCollapseModule],
  templateUrl: './planner-participants.component.html',
  styleUrl: './planner-participants.component.css'
})
export class PlannerParticipantsComponent {

	@Input() participants: any;
	@Input() participantsMap: any;
	@Input() showElement: boolean = true;
	@Input() thingsMap: any;
	@Input() tourData: any;
	@Input() tourID: number = -1;
	@Input() tourParticipants: any;
	@Input() tourThings: any;
	@Output() reloadData = new EventEmitter()
	@Output() showElementChange = new EventEmitter<boolean>();
    @ViewChild(AddParticipantComponent) AddParticipantComponent!: AddParticipantComponent;

	constructor(
        private tourService: TourService,
    ) {}

	ngOnInit(){
		console.log("thingsMap", this.thingsMap)
		console.log("participants", this.participants)
		console.log("tourParticipants", this.tourParticipants)
	}

	ngOnChanges(changes: SimpleChanges) {
        if (changes['participants']) {
            this.participants = changes['participants'].currentValue
        }
    }

  	addTourParticipant(inputData: any) {
		console.log("participantID", inputData.target.value)

		let participantID = inputData.target.value
		let participant = {
			id: Number(participantID),
			start: this.tourData.start,
			end: this.tourData.end,
			burdens: []
		}
		
		this.tourParticipants.push(participant)
		console.log("tourParticipants", this.tourParticipants)

		const data = {
			tourParticipants: JSON.stringify(this.tourParticipants),
		};

		this.tourService.put('tour/' + this.tourID + '/participants', data)
		.toPromise()
		.then((response) => {
			this.reloadData.emit()
			console.log('editTourParticipants - success', response);
		})
		.catch((error) => {
			console.error('editTourParticipants - error', error);
		});
	}

	getThingDetails(thing: Thing) : string {

        let dailyRation = thing.dailyRation!
        let weight = this.thingsMap[thing.id].weight
        let persons = this.participants.length
        let thingName = this.thingsMap[thing.id].name
		let result = 0

        if ( this.thingsMap[thing.id].category != 'items'){
            result = this.roundToTwoDecimals(persons * dailyRation * weight)
        } else {
            result = this.roundToTwoDecimals(dailyRation * weight)
        }

        return `<b>${thingName}</b> (${result}kg)`
        
    }

	isParticipantInTour(participantID: number) {
		for ( let tourParticipant of this.tourParticipants) {
			if ( participantID == tourParticipant.id) {
				return true
			}
		}
		return false
	}

	participantIsLazy(participantID: number) {
		for ( let thing of this.tourThings) {
			if ( participantID == thing.carrier) {
				return false
			}
		}
		return true
	}

	removeTourParticipant(participantID: string) {
		console.log("tourParticipants", this.tourParticipants)

		const index =  this.tourParticipants.findIndex((obj: any) => obj.id === participantID);

        if (index !== -1) {
            this.tourParticipants.splice(index, 1);
        } else {
            console.log('Participant not found.');
        }

		const data = {
			tourParticipants: JSON.stringify(this.tourParticipants),
		};

		this.tourService.put('tour/' + this.tourID + '/participants', data)
		.toPromise()
		.then((response) => {
			this.reloadData.emit()
			console.log('editTourParticipants - success', response);
		})
		.catch((error) => {
			console.error('editTourParticipants - error', error);
		});
	}

	roundToTwoDecimals(num: number): number {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }
}
