import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation  } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { addKeyInterceptor } from './core/interceptors/add-key.interceptor';
import { AuthGuard } from './core/guards/authGuard';

export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes, withHashLocation()),
      provideHttpClient(withFetch()),
      provideHttpClient(withInterceptors([addKeyInterceptor])),
      AuthGuard
    ]
};
