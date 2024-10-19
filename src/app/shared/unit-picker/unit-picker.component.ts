import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { foodUnits, Unit } from '../../core/models/units';

@Component({
    selector: 'app-unit-picker',
    standalone: true,
    imports: [CommonModule, FormsModule, NgbTypeaheadModule],
    templateUrl: './unit-picker.component.html',
    styleUrl: './unit-picker.component.css'
})

export class UnitPickerComponent {

    @Input() unitInput: number = 0;
    @Output() unitOutput = new EventEmitter<number>();
    selectedUnit: Unit = { 
        factor: 0,
        id: 0,
        unit: '',
    }
    units = foodUnits

    search: OperatorFunction<string, readonly { id: number, unit: string }[]> = (text$: Observable<string>) =>
    text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter((term) => term.length >= 1),
        map((term) => {
            const results: { id: number, unit: string }[] = [];
            for (const id in foodUnits) {
                if (foodUnits.hasOwnProperty(id)) {
                    const unit = foodUnits[id];
                    if (new RegExp(term, 'mi').test(unit.unit)) {
                        results.push(unit);
                    }
                }
            }
            return results.slice(0, 10);
        })
    );

    setUnit(event: any) {
        let unitID = event.target.value
        console.log("unitID", unitID)
        this.unitOutput.emit(unitID);
    }
		
	formatter = (x: { unit: string }) => x.unit;

}
