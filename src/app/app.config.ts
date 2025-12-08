import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideApi } from '../libs/ia-call-api/provide-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideApi({
      // basePath: 'https://reportes-api.onrender.com',
      basePath: 'https://api-voice.sistems-mik3.com',
      credentials: {
        bearerAuth: () => {
          return localStorage.getItem('jwt') ?? undefined;
        },
      },
    }),
  ],
};
