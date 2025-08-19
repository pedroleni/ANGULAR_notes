# Ciclo de Vida del Router y Eventos

Angular Router proporciona un conjunto completo de **hooks** y **eventos** del ciclo de vida que te permiten reaccionar a los cambios de navegación y ejecutar lógica personalizada durante el proceso de enrutamiento.

---

### 📌 En esta página

- Eventos comunes del router
- Cómo suscribirse a los eventos del router
- Cómo depurar eventos de enrutamiento
- Casos de uso comunes
- Todos los eventos del router

---

## 🔄 Eventos comunes del router

El Angular Router **emite eventos de navegación** a los que puedes suscribirte para hacer seguimiento del ciclo de vida de la navegación. Estos eventos están disponibles a través del observable `Router.events`.

A continuación, los más comunes, en **orden cronológico**:

| Evento | Descripción |
| --- | --- |
| `NavigationStart` | Ocurre cuando empieza una navegación. Incluye la URL solicitada. |
| `RoutesRecognized` | Se dispara cuando el router reconoce qué ruta coincide con la URL. Contiene información del estado de la ruta. |
| `GuardsCheckStart` | Comienza la fase de evaluación de *guards* (`canActivate`, `canDeactivate`). |
| `GuardsCheckEnd` | Termina la evaluación de *guards*. Incluye si se permitió o denegó. |
| `ResolveStart` | Comienza la fase de resolución de datos (`resolvers`). |
| `ResolveEnd` | Termina la resolución. Todos los datos están disponibles. |
| `NavigationEnd` | La navegación ha sido completada exitosamente. El router actualiza la URL. |
| `NavigationSkipped` | El router se salta la navegación (por ejemplo, si la URL no ha cambiado). |

Eventos de error más comunes:

| Evento | Descripción |
| --- | --- |
| `NavigationCancel` | Ocurre cuando el router cancela una navegación (por ejemplo, porque un guard devuelve `false`). |
| `NavigationError` | Ocurre cuando la navegación falla (por ejemplo, por rutas inválidas o errores en resolvers). |

---

## 🧭 Cómo suscribirse a eventos del router

Para ejecutar código en eventos de navegación específicos, puedes suscribirte a `router.events` y usar `instanceof` para comprobar el tipo de evento:

```tsx

import { Component, inject } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({ ... })
export class RouterEventsComponent {
  private readonly router = inject(Router);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('Navegación iniciada:', event.url);
      }
      if (event instanceof NavigationEnd) {
        console.log('Navegación completada:', event.url);
      }
    });
  }
}

```

📌 Nota: el tipo `Event` de `@angular/router` es distinto al tipo `Event` global del navegador.

---

## 🐞 Cómo depurar eventos de enrutamiento

Angular ofrece una herramienta para **depurar eventos de enrutamiento**, registrando todos los eventos del router en la consola.

Puedes habilitarlo usando `withDebugTracing()` al configurar el router:

```tsx

import { provideRouter, withDebugTracing } from '@angular/router';

const appRoutes: Routes = [];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withDebugTracing())
  ]
});

```

---

## 🧰 Casos de uso comunes

Los eventos del router permiten funciones prácticas en aplicaciones reales:

### ⏳ Indicadores de carga durante la navegación

```tsx

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loading',
  template: `
    @if (loading()) {
      <div class="loading-spinner">Cargando...</div>
    }
  `
})
export class AppComponent {
  private router = inject(Router);

  readonly loading = toSignal(
    this.router.events.pipe(
      map(() => !!this.router.getCurrentNavigation())
    ),
    { initialValue: false }
  );
}

```

---

### 📈 Seguimiento para analítica

```tsx

import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.analytics.trackPageView(event.urlAfterRedirects);
        }
      });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Página vista registrada:', url);
    }
  };
}

```

---

### 🚨 Manejo de errores en navegación

```tsx

import { Component, inject, signal } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  NavigationCancellationCode
} from '@angular/router';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Cerrar</button>
      </div>
    }
  `
})
export class ErrorHandlerComponent {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Error en navegación:', event.error);
        this.errorMessage.set('No se pudo cargar la página. Intenta de nuevo.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navegación cancelada:', event.reason);
        if (event.reason === NavigationCancellationCode.GuardRejected) {
          this.errorMessage.set('Acceso denegado. Verifica tus permisos.');
        }
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}

```

---

## 📋 Lista completa de eventos del Router

Organizados por categoría y en el orden en que suelen ocurrir:

---

### 🚦 Eventos de navegación

| Evento | Descripción |
| --- | --- |
| `NavigationStart` | Cuando comienza una navegación. |
| `RouteConfigLoadStart` | Antes de cargar una configuración de ruta por lazy loading. |
| `RouteConfigLoadEnd` | Después de cargar la configuración lazy. |
| `RoutesRecognized` | Cuando el router reconoce las rutas correspondientes a la URL. |
| `GuardsCheckStart` | Inicio de la fase de comprobación de guards. |
| `GuardsCheckEnd` | Fin de la comprobación de guards. |
| `ResolveStart` | Inicio de la fase de resolvers. |
| `ResolveEnd` | Fin de los resolvers. |

---

### 🔄 Eventos de activación

Se producen al instanciar y activar componentes de ruta:

| Evento | Descripción |
| --- | --- |
| `ActivationStart` | Inicio de la activación de ruta. |
| `ChildActivationStart` | Inicio de la activación de una ruta hija. |
| `ActivationEnd` | Fin de la activación de ruta. |
| `ChildActivationEnd` | Fin de la activación de una ruta hija. |

---

### ✅ Eventos finales de navegación

Toda navegación termina con **exactamente uno** de estos eventos:

| Evento | Descripción |
| --- | --- |
| `NavigationEnd` | La navegación fue exitosa. |
| `NavigationCancel` | El router la canceló. |
| `NavigationError` | La navegación falló por un error inesperado. |
| `NavigationSkipped` | El router la ignoró (por ejemplo, misma URL). |

---

### 🧭 Otros eventos

| Evento | Descripción |
| --- | --- |
| `Scroll` | Ocurre durante el desplazamiento (scrolling). |