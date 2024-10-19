import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarsharingComponent } from './carsharing.component';

describe('CarsharingComponent', () => {
  let component: CarsharingComponent;
  let fixture: ComponentFixture<CarsharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarsharingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarsharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
