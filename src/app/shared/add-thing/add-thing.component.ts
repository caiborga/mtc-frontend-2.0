import { Component, EventEmitter, inject, Input, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { CategoryData } from '../../pages/things/things.component';
import { TourService } from '../../core/services/tour.service';
import { UnitPickerComponent } from '../unit-picker/unit-picker.component';
import { foodUnits, Unit } from '../../core/models/units';

@Component({
    selector: 'app-add-thing',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgbPopoverModule, UnitPickerComponent],
    templateUrl: './add-thing.component.html',
    styleUrl: './add-thing.component.css'
})


export class AddThingComponent {

    @Input() data: CategoryData;
    @Input() symbol: string = 'ph ph-plus'
    @Output() reloadData = new EventEmitter();
    @ViewChild('content') contentTemplate!: TemplateRef<any>;

    selectedThingID: number = -1;

    thingForm = new FormGroup({
        category: new FormControl(''),
        id: new FormControl(-1),
        name: new FormControl('', Validators.required),
        perPerson: new FormControl(null, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]), 
        unit: new FormControl(0, Validators.required),
        weight: new FormControl<number | string | null>(null, [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]),
    });

    thingsMap: any;

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
        this.thingForm.controls.category.addValidators(Validators.required)
    }

    ngOnInit() {
        this.thingForm.get('category')!.setValue(this.data.category)
        this.thingsMap = this.data.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
        for (const key in this.data.relevantColumns) {
            if (!this.data.relevantColumns[key as keyof CategoryData["relevantColumns"]]) {
                if (key in this.thingForm.controls) {
                    const control = this.thingForm.get(key);
                    if (control) {
                        control.clearValidators();
                    }
                }
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('changes', changes)
        if (changes['data'] ) {
            this.data = changes['data'].currentValue
            this.thingsMap = this.data.things.reduce((obj, cur) => ({...obj, [cur.id]: cur}), {})
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

    initializeModal(thingID?: number) {
        if (thingID) {
            this.selectedThingID = thingID
            console.log(thingID)
            this.thingForm.setValue({
                category: this.data.category,
                id: thingID,
                name: this.thingsMap[thingID]['name'],
                perPerson: this.thingsMap[thingID]['per_person'], 
                unit: this.thingsMap[thingID]['unit_id'],
                weight: this.thingsMap[thingID]['weight'],
            })
        } else {
            this.selectedThingID = -1
            this.thingForm.setValue({
                category: this.data.category,
                id: -1,
                name: '',
                perPerson: null, 
                unit: null,
                weight: 'Wird automatisch berechnet',
            })
        }
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

    open() {
		this.modalService.open(this.contentTemplate, { ariaLabelledBy: 'modal-basic-title' })
	}

    setWeight() {
        
        let unitID = this.thingForm.get('unit')!.value
        let perPerson = this.thingForm.get('perPerson')!.value
        if (unitID && perPerson && !isNaN(perPerson)) {
            let factor = foodUnits[unitID].factor
            this.thingForm.controls['weight'].setValue(factor * perPerson);
            console.log("form", this.thingForm.value)
        }
    }

}
