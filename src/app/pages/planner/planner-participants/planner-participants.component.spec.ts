import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerParticipantsComponent } from './planner-participants.component';

describe('PlannerParticipantsComponent', () => {
  let component: PlannerParticipantsComponent;
  let fixture: ComponentFixture<PlannerParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannerParticipantsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlannerParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
