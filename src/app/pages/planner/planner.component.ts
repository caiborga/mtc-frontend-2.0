import { CommonModule } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule, FormBuilder } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule, NgbOffcanvas, NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps'
import { MapGeocoder } from '@angular/google-maps';

import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { AddParticipantComponent } from '../../shared/add-participant/add-participant.component';
import { AddThingComponent } from '../../shared/add-thing/add-thing.component';
import { PlannerParticipantsComponent } from './planner-participants/planner-participants.component';
import { PlannerThingsComponent } from './planner-things/things.component';
import { CarsharingComponent } from './planner-carsharing/carsharing.component';
import { Message, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { AddTourComponent } from '../../shared/add-tour/add-tour.component';

import { Tour } from '../../core/models/tour';

interface Car {
    seats?: Number,
    type?: String,
    passengers: Number[]
}

interface Meal {
    type: string,
    meal: string,
    date: string
}

export interface Participant {
    avatar?: string,
    burdens: Array<string>,
    id: number,
    name?: string,
    start?: string,
    end?: string
}

interface Thing {
    id: string,
    name?: string,
    carrier: string
}

@Component({
    selector: 'app-planner',
    standalone: true,
    imports: [
        AddParticipantComponent,
        AddThingComponent,
        AddTourComponent,
        CarsharingComponent,
        CommonModule, 
        DatePickerComponent, 
        FormsModule,
        GoogleMapsModule,
        MessageBoxComponent,
        NgbAccordionModule,
        NgbCollapseModule,
        NgbDropdownModule,
        ReactiveFormsModule,
        RouterLink,
        PlannerParticipantsComponent,
        PlannerThingsComponent
    ],
    templateUrl: './planner.component.html',
    styleUrl: './planner.component.css'
})
export class PlannerComponent {

    @ViewChild(CarsharingComponent) carSharingComponent!: CarsharingComponent;
    @ViewChild(MessageBoxComponent) messageBox:MessageBoxComponent = new MessageBoxComponent;

    center!: google.maps.LatLngLiteral;

    mapOptions: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoom : 15
    }

    tourCoordinates: Object = {}

    isCollapsed = false;
    loading: boolean = false;
    tableView = false;
    tour: Tour = {
        tourCars: {},
        tourData: {},
        tourParticipants: {},
        tourThings: {}
    };
    tourData: any;
    tourID: number = 0;
    newParticipant: Participant = {
        id: -1,
        name: '',
        burdens: []
    }
    participants: any;
    participantsMap: { [key: string]: Participant } = {};
    showCarSharingBool: boolean = true;
    showParticipantsBool: boolean = true;
    showThingsBool: boolean = true;
    tourCars: Array<Car> = [];
    tourForm = new FormGroup({
        arrivalChecked: new FormControl(false),
        departureChecked: new FormControl(true),
        start: new FormControl<Date | null>(null),
        name: new FormControl(''),
        end: new FormControl<Date | null>(null)
    });
    tourMeals: Array<Meal> = [];
    tourParticipants: Array<Participant> = [];
    tourParticipantsMap: any;
    tourThings: Array<Thing> = [];
    tourThingsMap: any;
    things: Array<Thing> = [];
    thingsMap: { [key: string]: Thing } = {};
    thingsForm = new FormGroup({
        things: this.formBuilder.array([])
    });
    meals: Array<Meal> = [];
    private sub: any;
    private offcanvasService = inject(NgbOffcanvas);

    constructor(
        private formBuilder: FormBuilder,
        private geocoder: MapGeocoder,
        private route: ActivatedRoute, 
        private tourService: TourService,
    ) {}

    ngOnInit() {    

        this.loading = true;
        this.sub = this.route.params.subscribe(params => {
            this.tourID = + params['id'];
        });

        this.getParticipants()
        this.getThings()
        this.getTourData(this.tourID)

    }

    changeTourData() {
        let data = {
            tourData: JSON.stringify(this.tourForm.value)
        }
        this.tourService.put('tour/' + this.tourID + '/data', data)
        .toPromise()
        .then((response) => {
            console.log('editTourThings - success', response);
        })
        .catch((error) => {
            console.error('editTourThings - error', error);
        });
        this.getTourData(this.tourData)
    }

    getParticipants() {
        this.tourService.get('participants')
        .toPromise()
        .then((response) => {
            this.participants = response.participants
            this.participantsMap = response.participants.reduce((obj: any, cur: any) => ({...obj, [cur.id]: cur}), {})
            console.log('getParticipants - success', response );
            for (var i = 0; i < response.participants.length; i++) {
                var id = response.participants[i].id;
                this.participantsMap[id] = response.participants[i];
            }
            console.log("participantsMap", this.participantsMap)

        })
        .catch((error) => {
            console.error('getParticipants - error', error);
        });
    }

    getThings() {
        this.tourService.get('things')
        .toPromise()
        .then((response) => {
            this.things = response.things
            this.thingsMap = response.things.reduce((obj: any, cur: any) => ({...obj, [cur.id]: cur}), {})
            if ( response.things.length > 0) {
                for (var i = 0; i < response.things.length; i++) {
                    var id = response.things[i].id;
                    this.thingsMap[id] = response.things[i];
                }
            }
            
            // console.log("thingsMap", this.thingsMap)

        })
        .catch((error) => {
            console.error('getThings - error', error);
        });
    }

    getTourData(tourID: number) {
        this.tourService.get('tour/' + tourID)
        .toPromise()
        .then((response) => {
            console.log('getTourData - success', response.tour);

            this.tourCars = JSON.parse(response.tour.tour_cars)
            this.tourData = JSON.parse(response.tour.tour_data)
            this.tourParticipants = JSON.parse(response.tour.tour_participants)
            this.tourThings = JSON.parse(response.tour.tour_things)

            this.tour.tourCars = this.tourCars
            this.tour.tourData = this.tourData
            this.tour.tourParticipants = this.tourParticipants
            this.tour.tourThings = this.tourThings

            console.log('getTourData - tourCars', this.tourCars);
            // console.log('getTourData - tourData', this.tourData);
            // console.log('getTourData - tourParticipants', this.tourParticipants);
            console.log('getTourData - tourThings', this.tourThings);
            
            this.tourForm.controls.start.setValue(this.tourData.start)
            this.tourForm.controls.end.setValue(this.tourData.end)
            this.tourForm.controls.arrivalChecked.setValue(this.tourData.arrivalChecked)
            this.tourForm.controls.departureChecked.setValue(this.tourData.departureChecked)

            this.geocoder.geocode({

                address: this.tourData.destination

            }).subscribe(({results}) => {
                console.log(results);
                console.log('laatitude:  ',results[0].geometry.location.lat());
                console.log('logitude:  ',results[0].geometry.location.lng());

                this.center = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                  };
            });

            // this.tourMeals = response.meals;
            this.loading = false;
        })
        .catch((error) => {
            console.error('getTourData - error', error);
            this.loading = false;
        });
    }

    openModal(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
	}

    openMessageBox(message: Message) {
        console.log("message", message)
        this.messageBox.changeSuccessMessage(message);
    }
}
