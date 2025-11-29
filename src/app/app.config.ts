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
      basePath: 'http://127.0.0.1:8000',
      credentials: {
        bearerAuth: () => {
          return localStorage.getItem('jwt') ?? undefined;
        },
      },
    }),
  ],
};
