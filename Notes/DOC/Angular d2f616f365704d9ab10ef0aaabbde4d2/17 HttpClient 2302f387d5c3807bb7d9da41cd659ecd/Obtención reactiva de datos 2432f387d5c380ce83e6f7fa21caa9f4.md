# Obtención reactiva de datos

## **IMPORTANTE**: `httpResource` es experimental. Está listo para que lo pruebes, pero podría cambiar antes de estabilizarse.

`httpResource` es un contenedor reactivo para `HttpClient` que expone tanto el estado de la solicitud como la respuesta mediante *signals*. Puedes usar estos signals con `computed`, `effect`, `linkedSignal` o cualquier otra API reactiva de Angular.

Como está construido sobre `HttpClient`, `httpResource` **soporta todas sus características**, incluidos los interceptores.

---

## 🧪 Usar `httpResource`

💡 **TIP**: Asegúrate de incluir `provideHttpClient` en los proveedores de tu aplicación. Consulta Configuración de HttpClient para más detalles.

Puedes definir un recurso HTTP devolviendo simplemente una URL:

```tsx

userId = input.required<string>();
user = httpResource(() => `/api/user/${userId()}`);

```

✅ `httpResource` es *reactivo*, lo que significa que **cada vez que cambie un signal del que depende (como `userId`)**, se lanzará automáticamente una nueva solicitud HTTP.

Si ya hay una solicitud pendiente, se **cancelará** antes de emitir una nueva.

💡 A diferencia de `HttpClient`, `httpResource` **lanza las solicitudes de forma inmediata**, sin necesidad de suscribirse.

---

### 🛠 Solicitudes más avanzadas

Puedes usar un objeto de configuración similar al de `HttpClient`.

Cualquier propiedad que deba ser reactiva debe construirse con un signal:

```tsx

user = httpResource(() => ({
  url: `/api/user/${userId()}`,
  method: 'GET',
  headers: {
    'X-Special': 'true',
  },
  params: {
    'fast': 'yes',
  },
  reportProgress: true,
  transferCache: true,
  keepalive: true,
  mode: 'cors',
  redirect: 'error',
  priority: 'high',
  cache : 'force-cache',
  credentials: 'include',
  referrer: 'no-referrer',
  integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY='
}));

```

⚠️ **TIP**: No uses `httpResource` para mutaciones (`POST`, `PUT`, etc). Para eso, utiliza directamente `HttpClient`.

---

### 📺 Usar los signals de `httpResource` en plantillas

Puedes usar los métodos `.hasValue()`, `.error()`, `.isLoading()` para controlar el renderizado en plantillas:

```html
@if(user.hasValue()) {
  <user-details [user]="user.value()">
} @else if (user.error()) {
  <div>No se pudo cargar la información del usuario</div>
} @else if (user.isLoading()) {
  <div>Cargando información del usuario...</div>
}

```

⚠️ **NOTA**: Si llamas a `.value()` cuando el recurso está en error, lanzará un error en tiempo de ejecución.

Usa `.hasValue()` como guardia.

---

## 🧾 Tipos de respuesta

Por defecto, `httpResource` espera que la respuesta sea **JSON**.

Puedes cambiar el tipo de respuesta con funciones auxiliares:

```tsx

httpResource.text(() => ({ … }));        // Devuelve string
httpResource.blob(() => ({ … }));        // Devuelve Blob
httpResource.arrayBuffer(() => ({ … })); // Devuelve ArrayBuffer

```

---

## ✅ Validación y parseo de respuestas

Puedes validar la respuesta con librerías como **Zod** o **Valibot** usando la opción `parse`.

El tipo de retorno de la función `parse` se convierte en el tipo del valor del recurso.

Ejemplo con Zod:

```tsx

const starWarsPersonSchema = z.object({
  name: z.string(),
  height: z.number({ coerce: true }),
  edited: z.string().datetime(),
  films: z.array(z.string()),
});

export class CharacterViewer {
  id = signal(1);
  swPersonResource = httpResource(
    () => `https://swapi.info/api/people/${this.id()}`,
    { parse: starWarsPersonSchema.parse }
  );
}

```

---

## 🧪 Testear `httpResource`

Como `httpResource` se basa en `HttpClient`, puedes testearlo usando las **mismas APIs de prueba** que `HttpClient`.

Ejemplo de test unitario:

```tsx

TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const id = signal(0);
const mockBackend = TestBed.inject(HttpTestingController);

const response = httpResource(() => `/data/${id()}`, {
  injector: TestBed.inject(Injector),
});

TestBed.tick(); // Activa el efecto
const firstRequest = mockBackend.expectOne('/data/0');
firstRequest.flush(0);

// Espera a que el valor se propague
await TestBed.inject(ApplicationRef).whenStable();

expect(response.value()).toEqual(0);

```

---