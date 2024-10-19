import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output  } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [CommonModule, NgbDatepickerModule, FormsModule, JsonPipe],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.css'
})
export class DatePickerComponent {

    @Output() startDatePicked = new EventEmitter<Date>();
    @Output() endDatePicked = new EventEmitter<Date>();


    calendar = inject(NgbCalendar);
	formatter = inject(NgbDateParserFormatter);

	hoveredDate: NgbDate | null = null;
	fromDate: NgbDate | null = this.calendar.getToday();
	toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 2);

	ngOnInit() {
		let today = new Date()
		this.startDatePicked.emit(today)
		this.endDatePicked.emit(today)
	}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
			const fromDatePicked = new Date(date.year, date.month - 1, date.day);
			this.startDatePicked.emit(fromDatePicked)
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
			const toDatePicked = new Date(date.year, date.month - 1, date.day);
			this.endDatePicked.emit(toDatePicked)
		} else {
			this.toDate = null;
			this.fromDate = date;
			const fromDatePicked = new Date(date.year, date.month - 1, date.day);
			this.startDatePicked.emit(fromDatePicked)
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
}
