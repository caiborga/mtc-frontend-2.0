import { Component, Input } from '@angular/core';

//Componentes
import { PlannerComponent } from '../../planner/planner.component';
import { ThingsComponent } from '../../things/things.component';
import { HomeComponent } from '../../home/home.component';

@Component({
    selector: 'app-content',
    standalone: true,
    imports: [ 
        HomeComponent, 
        PlannerComponent, 
        ThingsComponent
    ],
    templateUrl: './content.component.html',
    styleUrl: './content.component.css'
})
export class ContentComponent {

    @Input() page: string = '';

    ngOnInit() {
        this.page = 'home'
    }

}
