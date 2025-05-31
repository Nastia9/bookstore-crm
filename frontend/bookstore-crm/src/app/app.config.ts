import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';  
import { Box, LogIn, LucideAngularModule, Trash2, X }            from 'lucide-angular';
import { Home, ShoppingCart, Package as packageIcon, BookOpen, Users, LogOut, ChevronLeft, ChevronRight } from 'lucide';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({
        Home,
        ShoppingCart,
        Package: packageIcon,
        BookOpen,
        Users,
        LogOut,
        ChevronLeft,
        ChevronRight,
        X,
        Trash2,
        Box,
        LogIn
      })
    ),
    importProvidersFrom(NgbModule),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
