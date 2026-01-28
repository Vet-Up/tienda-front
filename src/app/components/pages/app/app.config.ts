import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';
import { authInterceptor } from '../../../core/services/auth-interceptor';
import { AuthService } from '../../../core/services/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      const token = authService.getToken();
      if (token) {
        return firstValueFrom(
          authService.validateToken(token).pipe(
            tap(user => {
              if (user) {
                authService.setUser(user);
              }
            })
          )
        );
      }
      return Promise.resolve();
    })
  ]
};
