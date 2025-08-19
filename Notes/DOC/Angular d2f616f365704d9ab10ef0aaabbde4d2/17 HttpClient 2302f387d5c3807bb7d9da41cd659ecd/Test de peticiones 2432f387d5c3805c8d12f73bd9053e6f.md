# Test de peticiones

Como con cualquier otra dependencia externa, es necesario **simular (mockear) el backend HTTP** para que los tests puedan imitar la interacción con un servidor remoto. Angular proporciona la librería `@angular/common/http/testing` que incluye herramientas para capturar las peticiones hechas por la app, hacer afirmaciones sobre ellas y simular respuestas como si vinieran del servidor.

Esta librería de test está diseñada para un patrón donde la app ejecuta código y realiza peticiones primero. Luego, el test:

1. Verifica que se hayan realizado ciertas peticiones (o no).
2. Realiza afirmaciones sobre esas peticiones.
3. Proporciona las respuestas simuladas haciendo `flush()`.

Al final del test, puedes verificar que no se hayan hecho peticiones inesperadas.

---

## ⚙️ Configuración para testear

Para empezar, debes configurar `TestBed` e **incluir**:

```tsx

provideHttpClient(),
provideHttpClientTesting(),

```

Esto hace que `HttpClient` use un backend de pruebas en lugar de la red real. También se proporciona el `HttpTestingController`, que te permite:

- Interactuar con el backend de prueba.
- Establecer expectativas sobre las peticiones realizadas.
- Simular respuestas (`flush()`).

🔁 **Importante**: Llama primero a `provideHttpClient()` y después a `provideHttpClientTesting()`. Si lo haces al revés, podrías romper los tests porque `provideHttpClientTesting()` sobrescribe configuraciones previas.

```tsx

TestBed.configureTestingModule({
  providers: [
    // otros providers de prueba
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});
const httpTesting = TestBed.inject(HttpTestingController);

```

---

## ✅ Esperar y responder a peticiones

Ejemplo de test que espera una petición `GET` y responde con datos simulados:

```tsx

TestBed.configureTestingModule({
  providers: [
    ConfigService,
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});
const httpTesting = TestBed.inject(HttpTestingController);

// Se usa ConfigService para pedir configuración
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` activa la petición y devuelve una promesa con la respuesta
const configPromise = firstValueFrom(config$);

// Esperamos la petición y hacemos afirmaciones
const req = httpTesting.expectOne('/api/config', 'Petición de configuración');
expect(req.request.method).toBe('GET');

// Simulamos la respuesta del backend
req.flush(DEFAULT_CONFIG);

// Comprobamos que la respuesta recibida es la esperada
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Verificamos que no queden peticiones pendientes
httpTesting.verify();

```

📝 **Nota**: `expectOne()` falla si hay más de una petición que coincida con los criterios.

También puedes usar un objeto para comprobar método y URL al mismo tiempo:

```tsx

const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, 'Petición de configuración');

```

💡 Las APIs de expectativa comparan con la **URL completa**, incluidos los parámetros de búsqueda.

### Buena práctica: verificar al final de cada test

```tsx

afterEach(() => {
  TestBed.inject(HttpTestingController).verify();
});

```

---

## 🧾 Gestionar múltiples peticiones

Si esperas **peticiones duplicadas**, usa `match()` en lugar de `expectOne()`:

```tsx

const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Simulas la respuesta para cada una
  req.flush({ result: 'mocked' });
}

```

Esto devuelve un array con todas las peticiones que coincidan. Tú eres responsable de hacer `flush()` y de verificar que se hayan manejado correctamente.

---

## 🔍 Coincidencia avanzada (Advanced matching)

Todas las funciones de coincidencia (`expectOne`, `match`, etc.) aceptan una función *predicate* (función personalizada) para aplicar lógica de coincidencia avanzada:

```tsx

// Buscar una petición que tenga cuerpo.
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);

```

### ❌ `expectNone`

Sirve para afirmar que **no se ha realizado ninguna petición** que cumpla cierto criterio:

```tsx

// Afirmar que no se han enviado peticiones de mutación (que no sean GET).
httpTesting.expectNone(req => req.method !== 'GET');

```

---

## 🛑 Testeo del manejo de errores

Es importante testear cómo responde tu aplicación cuando las peticiones HTTP **fallan**.

### ⚠️ Errores del servidor (backend)

Cuando el servidor devuelve un código de error (por ejemplo, 500), puedes simular ese fallo usando `flush()` con un estado y mensaje de error:

```tsx

const req = httpTesting.expectOne('/api/config');
req.flush('¡Fallo!', {status: 500, statusText: 'Error interno del servidor'});
// Aquí podrías afirmar que la app manejó correctamente el error.

```

---

### 🌐 Errores de red

También puedes simular **fallos de red**, como si se hubiera caído la conexión. Usa `req.error()` con un `ProgressEvent`:

```tsx

const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));
// Verifica que la aplicación manejó correctamente el error de red.

```

---

## 🛡️ Testear un Interceptor

Deberías testear que tus interceptores funcionan correctamente bajo las condiciones previstas.

Por ejemplo, si tienes un interceptor que añade un **token de autenticación** a cada petición:

```tsx

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}

```

### ✅ Configuración de `TestBed` para interceptores funcionales

```tsx

TestBed.configureTestingModule({
  providers: [
    AuthService,
    // Se recomienda testear un interceptor por separado
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});

```

Puedes inspeccionar la petición para verificar que el token fue añadido correctamente:

```tsx

const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');
expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());

```

---

## 🧱 Interceptor basado en clase (DI)

También puedes implementar el interceptor como clase inyectable:

```tsx

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}

```

### 🧪 Configuración `TestBed` para interceptores por clase (DI-based)

```tsx

TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
});

```

---

¿Quieres que ahora te traduzca también la sección de `HttpHeaders`, `HttpParams` o alguna otra parte de la documentación de Angular?