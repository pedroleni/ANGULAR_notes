# Interceptores

`HttpClient` admite una forma de middleware llamada **interceptores**.

### 🔍 Resumen rápido (TL;DR)

Los interceptores permiten implementar patrones comunes como:

- reintentos automáticos,
- caché de respuestas,
- registros (logs),
- autenticación,

...todo eso sin necesidad de repetir código en cada solicitud.

Angular ofrece **dos tipos** de interceptores:

- **Funcionales** (recomendados por su comportamiento más predecible),
- **Basados en DI** (inyección de dependencias), cubiertos al final de la guía.

---

## ✍️ Definir un interceptor

Un interceptor básico es una función que recibe:

- el `HttpRequest` saliente,
- una función `next()` que representa el siguiente paso en la cadena de interceptores.

**Ejemplo:**

```tsx

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}

```

☑️ Este interceptor muestra por consola la URL de la petición antes de pasarla al siguiente interceptor o al servidor.

---

## ⚙️ Configurar interceptores

Se configuran al registrar `HttpClient` en los `providers` de la app, usando `withInterceptors`:

```tsx

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([loggingInterceptor, cachingInterceptor])
    )
  ]
});

```

🔁 Los interceptores se ejecutan en **el orden en que aparecen en el array**.

---

## 🔄 Interceptar eventos de respuesta

Puedes manipular la respuesta transformando el flujo de eventos devuelto por `next(req)`:

```tsx

export function loggingInterceptor(req, next) {
  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'devuelve una respuesta con estado', event.status);
      }
    })
  );
}

```

📌 TIP: Los interceptores asocian naturalmente respuestas a sus peticiones porque trabajan sobre el mismo contexto cerrado.

---

## 🧬 Modificar peticiones

Tanto `HttpRequest` como `HttpResponse` son **inmutables**. Para modificarlos, debes clonarlos usando `.clone()`:

**Ejemplo: añadir una cabecera:**

```tsx

const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'nuevo valor'),
});

```

✅ Esto garantiza que el interceptor sea independiente (es decir, que si se ejecuta varias veces con la misma petición, no causa efectos inesperados).

🚨 **Advertencia**: El cuerpo (`body`) de la petición o respuesta **sí puede mutarse profundamente**, así que si lo alteras, asegúrate de que tu código puede ejecutarse múltiples veces sin errores.

## 🧪 Inyección de dependencias en interceptores

Los interceptores se ejecutan en el **contexto de inyección** del `Injector` que los registró, y pueden usar la función `inject()` de Angular para obtener servicios.

**Ejemplo:**

Supongamos que tienes un servicio `AuthService` que genera tokens de autenticación para las peticiones. Un interceptor puede inyectarlo así:

```tsx

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authToken = inject(AuthService).getAuthToken();
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}

```

---

## 🏷️ Metadatos en peticiones y respuestas

A veces necesitas **adjuntar información a una petición** que no debe enviarse al backend, sino que es útil para el propio interceptor. Angular permite esto mediante el objeto `.context` de `HttpRequest`, que almacena metadatos usando instancias de `HttpContext`.

### 🎯 Ejemplo: habilitar o deshabilitar caché

Define un token de contexto para indicar si debe aplicarse el cacheo:

```tsx

export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);

```

Esto establece `true` como valor predeterminado para las peticiones que no lo definan explícitamente.

### 👓 Leer el token en un interceptor

```tsx

export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // aplicar lógica de caché
    return ...;
  } else {
    // no aplicar caché
    return next(req);
  }
}

```

### 🧾 Establecer tokens al hacer una petición

Puedes incluir el token en la petición directamente:

```tsx

const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});

```

🔁 **Importante**: `HttpContext` es **mutable**, a diferencia de otras propiedades del `HttpRequest`. Si un interceptor modifica el contexto, ese cambio persistirá en reintentos posteriores. Esto es útil para pasar estado entre intentos.

---

## 🧪 Respuestas sintéticas

Un interceptor **no está obligado** a llamar a `next(req)`. Puede, en cambio, generar una **respuesta manual** desde caché u otra fuente:

```tsx

const resp = new HttpResponse({
  body: 'cuerpo de la respuesta',
});
return of(resp);

```

Esto permite interceptores más avanzados que no necesariamente se comuniquen con el backend.

---

## 🧱 Interceptores basados en DI (clases)

Angular también admite interceptores definidos como **clases inyectables** que implementan la interfaz `HttpInterceptor`.

### 🧩 Ejemplo:

```tsx

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('URL de la petición: ' + req.url);
    return handler.handle(req);
  }
}

```

### 🧷 Configuración:

```tsx

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptorsFromDi() // importante para habilitar interceptores por DI
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true
    }
  ]
});

```

⚠️ **Advertencia**: El orden en el que se ejecutan estos interceptores depende del orden de registro de los `providers`, lo cual puede volverse difícil de predecir en configuraciones complejas.