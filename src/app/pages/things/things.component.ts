import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';

import { MealComponent } from './meal/meal.component';
import { ThingComponent } from './thing/thing.component';
import { TourService } from '../../core/services/tour.service';

export interface Thing {
    id: number,
    category: string,
    name: string,
    per_person: Number,
    unit_id: number,
    weight: Number,
}

export interface CategoryData {
    category: string,
    relevantColumns: {
        category: boolean,
        name: boolean,
        perPerson: boolean,
        unit: boolean,
        weight: boolean,
    }
    things: Thing[],
    title: string,
}

@Component({
    selector: 'app-things',
    standalone: true,
    imports: [
        MealComponent, 
        NgbNavModule,
        RouterLink, 
        ThingComponent,
    ],
    templateUrl: './things.component.html',
    styleUrl: './things.component.css'
})

export class ThingsComponent {

    activeTab = 1;
    things: Thing[] = []
    participantForm = new FormGroup({
        arrival: new FormControl<Date | ''>(''),
        departure: new FormControl<Date | ''>(''),
        name: new FormControl(''),
        things: new FormControl(''),
    });

    categories: CategoryData[] = [];

    constructor(
        private tourService: TourService
    ) {}

    ngOnInit(){
        this.loadThings()
    }

    loadThings(){
        this.tourService.get('things')
        .toPromise()
        .then((response) => {
            this.things = response.things
            this.defineCategories()
            console.log('getThings - success', response);
            console.log('this.things', this.things);
        })
        .catch((error) => {
            this.defineCategories()
            console.error('getThings - error', error);
        });
    }

    defineCategories(){
        this.categories = [];
        const Food : CategoryData = {
            category: 'food',
            relevantColumns: {
                category: false,
                name: true,
                perPerson: true,
                unit: true,
                weight: true,
            },
            things: this.things,
            title: 'Nahrungsmittel',
        }
        const Consumables : CategoryData = {
            category: 'consumables',
            relevantColumns: {
                category: false,
                name: true,
                perPerson: true,
                unit: true,
                weight: true,
            },
            things: this.things,
            title: 'Verbrauchsmaterial',
        }
        const Items : CategoryData = {
            category: 'items',
            relevantColumns: {
                category: false,
                name: true,
                perPerson: false,
                unit: false,
                weight: true,
            },
            things: this.things,
            title: 'Gegenstände',
        }
        this.categories.push(Food)
        this.categories.push(Consumables)
        this.categories.push(Items)
    }
}
