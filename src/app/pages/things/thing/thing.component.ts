import { Component, EventEmitter, inject, Input, OnChanges, Output, TemplateRef, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { TourService } from '../../../core/services/tour.service';
import { UnitPickerComponent } from '../../../shared/unit-picker/unit-picker.component';
import { CategoryData } from '../things.component';
import { foodUnits, Unit } from '../../../core/models/units';
import { AddThingComponent } from '../../../shared/add-thing/add-thing.component';

@Component({
  selector: 'app-thing',
  standalone: true,
  imports: [AddThingComponent, ReactiveFormsModule, UnitPickerComponent],
  templateUrl: './thing.component.html',
  styleUrl: './thing.component.css'
})

export class ThingComponent implements OnChanges{
    
    @Input() data: CategoryData;
    @Output() reloadData = new EventEmitter();
    @ViewChild(AddThingComponent) AddThingComponent!: AddThingComponent;

    thingForm = new FormGroup({
        category: new FormControl(''),
        id: new FormControl(-1),
        name: new FormControl(''),
        perPerson: new FormControl(null), 
        unitID: new FormControl(0),
        weight: new FormControl(null),
    });

    loadingData: boolean = false;
    selectedThingID: number = -1;
    thingsMap: any;
    foodUnits: any;

    private modalService = inject(NgbModal);
	
    constructor(
        private tourService: TourService
    ) {
        this.data = {
            category: '',
            relevantColumns: {
                category: true,
                name: true,
                perPerson: true,
                unit: true,
                weight: true,
            },
            things: [],
            title: '',
        }
    }

    ngOnInit() {
        this.foodUnits = foodUnits
        console.log(this.data)
        if (this.data) {
            this.thingForm.get('category')!.setValue(this.data.category)
            this.thingsMap = this.data.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
            console.log("thingsMap", this.thingsMap )
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes['data'].isFirstChange()) {
            console.log('ngOnChanges:', changes['data'].currentValue);
            this.data = changes['data'].currentValue
            this.thingsMap = this.data.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
            console.log("thingsMap", this.thingsMap )

            this.loadingData = false;
        }
    }

    open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
	}

    newThing() {
        console.log("thingForm", this.thingForm)
        this.tourService.post('things', this.thingForm.value)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('newThing - success', response);
        })
        .catch((error) => {
            console.error('newThing - error', error);
        });
    }

    initializeModal(thingID?: number) {
        if (thingID) {
            this.selectedThingID = thingID
            console.log(thingID)
            this.thingForm.setValue({
                category: this.data.category,
                id: thingID,
                name: this.thingsMap[thingID]['name'],
                perPerson: this.thingsMap[thingID]['perPerson'], 
                unitID: this.thingsMap[thingID]['unitID'],
                weight: this.thingsMap[thingID]['weight'],
            })
        } else {
            this.selectedThingID = -1
            this.thingForm.setValue({
                category: this.data.category,
                id: -1,
                name: '',
                perPerson: null, 
                unitID: null,
                weight: null,
            })
        }
    }

    editThing() {
        this.tourService.put('things/'+ this.thingForm.value.id, this.thingForm.value)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('editThing - success', response);
        })
        .catch((error) => {
            console.error('editThing - error', error);
        });
    }

    deleteThing(thingID: number) {
        this.tourService.delete('things/'+thingID)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('deleteThing - success', response);
        })
        .catch((error) => {
            console.error('deleteThing - error', error);
        });
    }
}
