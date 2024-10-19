import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { TopbarComponent } from './pages/layout/topbar/topbar.component';
import { FooterComponent } from './pages/layout/footer/footer.component';
import { ContentComponent } from './pages/layout/content/content.component';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, TopbarComponent, FooterComponent, ContentComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'mtc';
}
