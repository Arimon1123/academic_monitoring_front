import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RxStompService } from './service/rx-stomp.service';
import { rxStompServiceFactory } from '../../rx-stomp-service-factory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: RxStompService, useFactory: rxStompServiceFactory },
  ],
};
