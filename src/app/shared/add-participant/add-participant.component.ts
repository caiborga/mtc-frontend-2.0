import { Component, EventEmitter, inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Message, MessageBoxComponent } from '../message-box/message-box.component';

@Component({
    selector: 'app-add-participant',
    standalone: true,
    imports: [FormsModule, MessageBoxComponent, ReactiveFormsModule],
    templateUrl: './add-participant.component.html',
    styleUrl: './add-participant.component.css'
})

export class AddParticipantComponent {

    @Input() editParticipantInput: any;
    @Input() symbol: string = 'ph ph-user-plus'
    @Output() reloadData = new EventEmitter();
    @ViewChild('content') contentTemplate!: TemplateRef<any>;
    @ViewChild(MessageBoxComponent) messageBox:MessageBoxComponent = new MessageBoxComponent;

    loadingData: boolean = false;

    participantForm = new FormGroup({
        avatar: new FormControl(''),
        id: new FormControl(''),
        name: new FormControl('', Validators.required),
    });

    private modalService = inject(NgbModal);

    constructor(
        private tourService: TourService,
    ) {}

    ngOnChanges(changes: any) {
        console.log("ngOnChanges", changes)
        if ( changes.editParticipantInput && !changes.editParticipantInput.firstChange ) {
            this.participantForm.setValue(changes.editParticipantInput.currentValue)
            this.openModal()
        }
    }

    addParticipant() {
        let avatar = this.generateAvatarNumber()
        this.participantForm.get('avatar')?.setValue(String(avatar))
        this.loadingData = true;
        this.tourService.post('participants', this.participantForm.value)
        .toPromise()
        .then((response) => {
            this.reloadData.emit()
            console.log('addParticipant - success', response);
        })
        .catch((error) => {
            this.loadingData = false;
            console.error('addParticipant - error', error);
        });
    }

    editParticipant() {
        console.log(this.participantForm)
        this.tourService.put('participants/' + this.participantForm.get('id')!.value, this.participantForm.value)
        .toPromise()
        .then((response) => {
            this.reloadData.emit();
            console.log('Edit participant - success', response);
        })
        .catch((error) => {
            console.error('Edit participant - error', error);
        });
    }

    generateAvatarNumber(): number {
        let min = 1
        let max = 16
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    resetForm() {
        this.editParticipantInput = false;
        this.participantForm.setValue(
            {
                avatar: '',
                id: '',
                name: ''
            }
        )
    }

    openModal() {
		this.modalService.open(this.contentTemplate, { ariaLabelledBy: 'modal-basic-title' })
	}

    openMessageBox(message: Message) {
        console.log("message", message)
        this.messageBox.changeSuccessMessage(message);
    }
}
