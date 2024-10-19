import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AddThingComponent } from '../../../shared/add-thing/add-thing.component';
import { TourService } from '../../../core/services/tour.service';
import { Unit, foodUnits } from '../../../core/models/units';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


export interface Thing {
    dailyRation?: number,
    id: string,
    name?: string,
    carrier: string,
    weight?: number
}

@Component({
  selector: 'app-planner-things',
  standalone: true,
  imports: [AddThingComponent, FormsModule, NgbPopoverModule],
  templateUrl: './things.component.html',
  styleUrl: './things.component.css'
})
export class PlannerThingsComponent {

    @Input() participants: any;
    @Input() showElement: boolean = true;
    @Input() tourData: any;
    @Input() tourID: number = 0;
    @Input() things: any;
    @Input() thingsMap: any;
	@Input() tourParticipants: any;
    @Input() tourThings: any;
    @Output() reloadData = new EventEmitter()
    @Output() showElementChange = new EventEmitter<boolean>();
    @ViewChild(AddThingComponent) AddThingComponent!: AddThingComponent;

    foodUnits: any = foodUnits

    constructor(
        private tourService: TourService,
    ) {}


    ngOnChanges(changes: SimpleChanges) {
        if (changes['thingsMap']) {
            
            this.thingsMap = changes['thingsMap'].currentValue
        }
        if (changes['things']) {
            
            this.things = changes['things'].currentValue
        }
    }

    addTourThing(inputData: any) {
        let thing = {
            carrier: '',
            dailyRation: 1,
            id: inputData.target.value,
        }
        this.tourThings.push(thing)

        this.editTourThings()
    }

    assignThingTo(thingID: string, event: any){
        console.log("thingID", thingID, "event", event)
        let carrierID = event.target.value

        const foundObject = this.tourThings.find((item: any) => item.id === thingID);
        
        if (foundObject) {
            foundObject.carrier = carrierID;
            console.log("Object found and updated:", foundObject);
        } else {
            console.log("Object with ID", thingID, "not found.");
        }

        this.editTourThings()
    }

    editTourThings() {
        const data = {
            tourThings: JSON.stringify(this.tourThings),
        };

        this.tourService.put('tour/' + this.tourID + '/things', data)
        .toPromise()
        .then((response) => {
        
            this.reloadData.emit();
            console.log('editTourThings - success', response);
        })
        .catch((error) => {
            console.error('editTourThings - error', error);
        });
    }

    isParticipantInTour(participantID: number) {
		for ( let tourParticipant of this.tourParticipants) {
			if ( participantID == tourParticipant.id) {
				return true
			}
		}
		return false
	}

    isThingInTour(thingID: number) {
        for ( let thing of this.tourThings) {
			if ( thingID == thing.id) {
				return true
			}
		}
		return false
	}

    roundToTwoDecimals(num: number): number {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    }

    getThingDetails(thing: Thing) : string {

        let dailyRation = thing.dailyRation!
        let weight = this.thingsMap[thing.id].weight
        let persons = this.tourParticipants.length
        let thingName = this.thingsMap[thing.id].name
        let result = 0

        if ( this.thingsMap[thing.id].category != 'items'){
            result = this.roundToTwoDecimals(persons * dailyRation * weight)
        } else {
            result = this.roundToTwoDecimals(dailyRation * weight)
        }


        return `<b>${result}</b> kg ${thingName}`
        
    }

    getPopoverTitle(thing: Thing) : string {
        let thingName = this.thingsMap[thing.id].name

        return `Berechnung ${thingName}`
    }

    getngbPopover(thing: Thing) : string {
        if ( this.thingsMap ) {
            let dailyRation = thing.dailyRation!
            let perPerson = this.thingsMap[thing.id].per_person
            let persons = this.tourParticipants.length
            let unit = foodUnits[this.thingsMap[thing.id].unit_id].unit
            let thingName = this.thingsMap[thing.id].name
            return `${perPerson} ${unit} * ${dailyRation} Tagesrationen für ${persons} Personen`
        }
        return ''
    }

    removeTourThing(id: string) {

        console.log("this.tourThings", this.tourThings)

        const index =  this.tourThings.findIndex((obj: any) => obj.id === id);

        if (index !== -1) {
            // Entferne das Objekt aus dem Array
            this.tourThings.splice(index, 1);
        } else {
            console.log('Objekt mit der ID wurde nicht gefunden.');
        }

        this.editTourThings()
    }
}
