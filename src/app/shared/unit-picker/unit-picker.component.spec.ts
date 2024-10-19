import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitPickerComponent } from './unit-picker.component';

describe('UnitPickerComponent', () => {
  let component: UnitPickerComponent;
  let fixture: ComponentFixture<UnitPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitPickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnitPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
