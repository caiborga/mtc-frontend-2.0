import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlannerThingsComponent } from './things.component';

describe('ThingsComponent', () => {
    let component: PlannerThingsComponent;
    let fixture: ComponentFixture<PlannerThingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
        imports: [PlannerThingsComponent]
        })
        .compileComponents();
        
        fixture = TestBed.createComponent(PlannerThingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
