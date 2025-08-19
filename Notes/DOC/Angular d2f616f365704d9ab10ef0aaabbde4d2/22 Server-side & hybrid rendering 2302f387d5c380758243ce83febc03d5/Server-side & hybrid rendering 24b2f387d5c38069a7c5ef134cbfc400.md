# Server-side & hybrid rendering

Angular entrega todas las aplicaciones como **renderizado en cliente** (*Client-Side Rendering*, CSR) por defecto.

Si bien este enfoque ofrece una carga inicial ligera, presenta desventajas como tiempos de carga más lentos, métricas de rendimiento degradadas y mayor consumo de recursos, ya que el dispositivo del usuario realiza la mayoría de los cálculos.

Como resultado, muchas aplicaciones logran mejoras significativas en rendimiento integrando **renderizado en servidor** (*Server-Side Rendering*, SSR) dentro de una estrategia de **renderizado híbrido**.

---

## ¿Qué es el renderizado híbrido?

El renderizado híbrido permite combinar las ventajas de:

- **SSR** (Server-Side Rendering)
- **Prerender** o **SSG** (Static Site Generation)
- **CSR** (Client-Side Rendering)

De este modo, puedes controlar con precisión cómo se renderiza cada parte de tu aplicación, optimizando la experiencia para tus usuarios.

---

## Configurar renderizado híbrido

Puedes crear un nuevo proyecto con renderizado híbrido usando la opción `--ssr` del CLI:

```bash

ng new --ssr

```

También puedes habilitarlo en un proyecto existente:

```bash

ng add @angular/ssr

```

> Nota:
> 
> 
> Por defecto, Angular prerenderiza toda tu aplicación y genera un archivo de servidor.
> 
> - Para deshabilitar esto y crear una aplicación totalmente estática, establece `outputMode` en `static`.
> - Para habilitar SSR, actualiza las rutas del servidor a `RenderMode.Server`.
>     
>     Consulta **Server routing** y **Generate a fully static application** para más detalles.
>     

---

## Enrutamiento en servidor

### Configuración de rutas en servidor

Puedes crear la configuración de rutas del servidor declarando un array de objetos `ServerRoute`, normalmente en `app.routes.server.ts`:

```tsx

// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // Renderizado en cliente (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // Página estática prerenderizada (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // Requiere datos específicos de usuario (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // Resto de rutas, renderizado en servidor (SSR)
    renderMode: RenderMode.Server,
  },
];

```

Añádelo a tu app con `provideServerRendering` y `withRoutes`:

```tsx

import { provideServerRendering, withRoutes } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
  ]
};

```

---

### Patrón App Shell

Si usas el patrón **App Shell**, debes indicar el componente que actuará como shell para rutas CSR:

```tsx

import { provideServerRendering, withRoutes, withAppShell } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      withRoutes(serverRoutes),
      withAppShell(AppShellComponent),
    ),
  ]
};

```

---

## Modos de renderizado

La configuración de rutas en servidor permite definir cómo se renderiza cada ruta usando `RenderMode`:

| Modo | Descripción |
| --- | --- |
| **Server (SSR)** | Renderiza en servidor por cada petición, enviando HTML completo al navegador. |
| **Client (CSR)** | Renderiza en el navegador (comportamiento por defecto de Angular). |
| **Prerender (SSG)** | Renderiza en tiempo de compilación, generando HTML estático para cada ruta. |

---

## Elegir el modo de renderizado

### **CSR** (Client-Side Rendering)

- Más simple de desarrollar.
- Puedes usar librerías que asumen un entorno navegador.
- Menor rendimiento: el usuario espera a que JS descargue, parse y ejecute.
- SEO limitado: los *crawlers* ejecutan poco JavaScript.
- Menor coste de servidor: solo sirve assets estáticos.
- Útil para aplicaciones *offline* con *service workers*.

---

### **SSR** (Server-Side Rendering)

- Carga más rápida: el servidor envía HTML completo.
- Mejor SEO: el *crawler* recibe HTML renderizado.
- Requiere código que no dependa estrictamente de APIs del navegador.
- Puede aumentar el coste de hosting, ya que el servidor procesa cada petición.

---

### **Prerender / SSG** (Static Site Generation)

- Carga más rápida que CSR y SSR.
- El servidor entrega HTML ya generado en *build-time*.
- Requiere que todos los datos estén disponibles en tiempo de compilación.
- No puede incluir datos personalizados por usuario.
- Ideal para páginas iguales para todos los usuarios.
- Puede aumentar el tiempo de *build* y el tamaño del despliegue.
- Excelente SEO.
- Muy bajo coste por petición (HTML estático, cacheable por CDN).
- Escalable y útil para alto tráfico.

> Nota: Si usas service worker de Angular, la primera carga será SSR, pero las siguientes serán CSR manejadas por el service worker.
> 

---

## **Configurar encabezados y códigos de estado**

Puedes establecer **encabezados personalizados** y **códigos de estado** para rutas específicas del servidor usando las propiedades `headers` y `status` en la configuración de `ServerRoute`:

```tsx

// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... otras rutas
];

```

---

## **Redirecciones**

Angular maneja las redirecciones especificadas con `redirectTo` de manera diferente en el servidor:

- **SSR (Server-Side Rendering):** Las redirecciones se realizan mediante redirecciones HTTP estándar (por ejemplo, 301, 302).
- **Prerender (SSG):** Las redirecciones se implementan como *soft redirects* usando etiquetas HTML `<meta http-equiv="refresh">` en el HTML prerenderizado.

---

## **Personalizar el prerenderizado en tiempo de compilación (SSG)**

Cuando se usa `RenderMode.Prerender`, puedes configurar varias opciones para personalizar el prerenderizado y la forma en que se sirven los archivos.

### **Rutas con parámetros**

En cada ruta con `RenderMode.Prerender` puedes definir `getPrerenderParams`, una función que determina qué valores de parámetros generan documentos prerenderizados separados.

Esta función devuelve una **promesa** que resuelve en un array de objetos, donde cada objeto mapea nombre de parámetro → valor.

Ejemplo: para la ruta `post/:id`, la función podría devolver:

```tsx

[{ id: 123 }, { id: 456 }]

```

Generando así `/post/123` y `/post/456`.

Puedes usar `inject` para obtener dependencias y, por ejemplo, llamar a un servicio para obtener los valores.

También es posible usar rutas **catch-all** (`/**`) donde el parámetro se llama `"**"`.

```tsx

// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // ['1','2','3']
      return ids.map(id => ({ id }));
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { id: '1', '**': 'foo/3' },
        { id: '2', '**': 'bar/4' },
      ];
    },
  },
];

```

> Importante: getPrerenderParams solo se aplica a RenderMode.Prerender y se ejecuta siempre en tiempo de compilación, sin acceso a APIs del navegador o del servidor.
> 
> 
> Además, `inject` debe llamarse de forma **sincrónica** y no después de `await`.
> 

---

## **Estrategias de fallback**

En `RenderMode.Prerender` puedes definir un comportamiento para peticiones de rutas que **no** se prerenderizaron:

- **Server:** (por defecto) usar SSR como fallback.
- **Client:** usar CSR como fallback.
- **None:** no manejar la ruta.

```tsx

// app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      return [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
];

```

---

## **Componentes compatibles con servidor**

En SSR no existen APIs del navegador como `window`, `document`, `navigator`, `location` o ciertas propiedades de `HTMLElement`.

El código que dependa de símbolos específicos del navegador debe ejecutarse **solo en el cliente**, por ejemplo usando los hooks `afterEveryRender` y `afterNextRender`, que se ejecutan únicamente en el navegador:

```tsx

import { Component, ViewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  @ViewChild('content') contentRef: ElementRef;

  constructor() {
    afterNextRender(() => {
      console.log('content height: ' + this.contentRef.nativeElement.scrollHeight);
    });
  }
}

```

---

## **Acceder a Request y Response vía DI**

`@angular/core` expone tokens para interactuar con el entorno SSR:

- **REQUEST:** Objeto `Request` (Web API), con cabeceras, cookies, etc.
- **RESPONSE_INIT:** Objeto `ResponseInit` para configurar cabeceras y código de estado dinámicamente.
- **REQUEST_CONTEXT:** Contexto adicional relacionado con la petición.

```tsx

import { inject, REQUEST } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}

```

> Estos tokens serán null en:
> 
> - El proceso de build.
> - CSR en navegador.
> - SSG.
> - Extracción de rutas en desarrollo.

---

## **Generar una aplicación completamente estática**

Por defecto, Angular prerenderiza toda la app y genera un archivo de servidor.

Para hacer una app **solo estática**, establece en `angular.json`:

```json

{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}

```

Esto genera HTML estático para cada ruta en *build-time* sin archivo de servidor.

---

## **Cachear datos con HttpClient**

En SSR, `HttpClient` cachea las peticiones HEAD y GET (sin `Authorization` o `Proxy-Authorization`) y transfiere los datos al cliente para evitar peticiones duplicadas en el render inicial.

Puedes personalizar este comportamiento con `withHttpTransferCacheOptions`:

```tsx

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true
    }))
  ]
});

```

---

## **Configurar un servidor**

### **En Node.js**

`@angular/ssr/node` extiende SSR para Node.js con APIs específicas:

```tsx

// server.ts
import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp.handle(req)
    .then(response => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next();
      }
    })
    .catch(next);
});

export const reqHandler = createNodeRequestHandler(app);

```

---

### **En entornos no Node.js**

`@angular/ssr` usa `Request` y `Response` estándar de la Web API para permitir SSR en otros entornos: