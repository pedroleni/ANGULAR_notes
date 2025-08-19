# Realizar peticiones HTTP

`HttpClient` tiene métodos correspondientes a los diferentes verbos HTTP usados para hacer solicitudes, tanto para obtener datos como para aplicar cambios en el servidor. Cada método devuelve un `Observable` de RxJS que, al suscribirse, envía la solicitud y luego emite los resultados cuando el servidor responde.

> 🔔 NOTA: Los Observable creados por HttpClient pueden ser suscritos cualquier número de veces, y cada vez harán una nueva petición al servidor.
> 

A través de un objeto de opciones pasado al método de solicitud, se pueden ajustar varias propiedades de la petición y del tipo de respuesta devuelto.

---

## 🔍 Obtener datos JSON

Obtener datos desde un backend a menudo requiere hacer una solicitud `GET` usando el método `HttpClient.get()`. Este método toma dos argumentos:

1. La URL (en forma de cadena) desde la que obtener los datos.
2. Un objeto de opciones opcional para configurar la petición.

Ejemplo para obtener datos de configuración desde una API hipotética:

```tsx

http.get<Config>('/api/config').subscribe(config => {
  // procesar la configuración.
});

```

✅ Observa el argumento genérico `<Config>`, que indica que los datos que devuelve el servidor tendrán el tipo `Config`.

Este argumento es **opcional**, y si lo omites, los datos devueltos tendrán el tipo `Object`.

💡 **Consejo**: Cuando trabajes con datos de estructura incierta o con posibles valores `undefined` o `null`, considera usar el tipo `unknown` en lugar de `Object` como tipo de respuesta.

🚨 **Crítico**: El tipo genérico de los métodos de petición es una **aserción de tipo** sobre los datos que devolverá el servidor.

`HttpClient` **no verifica** que los datos devueltos coincidan realmente con ese tipo.

---

## 🎛 Obtener otros tipos de datos

Por defecto, `HttpClient` asume que el servidor devolverá datos en formato JSON.

Cuando interactúas con una API que **no** devuelve JSON, puedes decirle a `HttpClient` qué tipo de respuesta debe esperar mediante la opción `responseType`.

| Valor de `responseType` | Tipo de respuesta devuelta |
| --- | --- |
| `'json'` (por defecto) | Datos JSON del tipo genérico indicado |
| `'text'` | Datos como cadena de texto |
| `'arraybuffer'` | `ArrayBuffer` con los bytes crudos |
| `'blob'` | Instancia de `Blob` |

Ejemplo: para descargar los bytes crudos de una imagen `.jpeg` como `ArrayBuffer`:

```tsx

http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe(buffer => {
  console.log('La imagen tiene ' + buffer.byteLength + ' bytes');
});

```

🧠 **Nota sobre valores literales**:

Dado que `responseType` afecta el tipo devuelto por `HttpClient`, **debe** ser un **tipo literal**, no una variable de tipo `string`.

Esto ocurre automáticamente si el objeto de opciones pasado es literal.

Pero si lo extraes a una variable o lo pasas por un método auxiliar, es posible que tengas que especificarlo así:

```tsx

const opts = {
  responseType: 'text' as const
};

```

---

## 🔄 Modificar el estado del servidor (Mutating server state)

Las APIs del servidor que realizan mutaciones suelen requerir hacer peticiones `POST` con un **cuerpo (`body`)** que especifique el nuevo estado o el cambio que se va a realizar.

El método `HttpClient.post()` se comporta de forma similar a `get()`, pero acepta un argumento adicional que representa el cuerpo antes de las opciones:

```tsx

http.post<Config>('/api/config', newConfig).subscribe(config => {
  console.log('Configuración actualizada:', config);
});

```

🧾 **Tipos de valores** que pueden proporcionarse como cuerpo de la solicitud y cómo los serializa `HttpClient`:

| Tipo de `body` | Se serializa como |
| --- | --- |
| `string` | Texto plano |
| `number`, `boolean`, `array`, objeto | JSON |
| `ArrayBuffer` | Datos en crudo desde el buffer |
| `Blob` | Datos en crudo con el tipo de contenido del blob |
| `FormData` | Datos codificados como `multipart/form-data` |
| `HttpParams` o `URLSearchParams` | Cadena con formato `application/x-www-form-urlencoded` |

⚠️ **IMPORTANTE**: Recuerda usar `.subscribe()` para que se ejecute la solicitud. Sin suscripción, la petición no se envía.

---

## 🧩 Establecer parámetros en la URL (Setting URL parameters)

Para añadir parámetros a la URL de la solicitud, usa la opción `params`.

✅ La forma más sencilla es pasar un objeto literal:

```tsx

http.get('/api/config', {
  params: { filter: 'all' },
}).subscribe(config => {
  // ...
});

```

🛠️ Si necesitas mayor control sobre la construcción o serialización de los parámetros, usa una instancia de `HttpParams`:

```tsx

const baseParams = new HttpParams().set('filter', 'all');

http.get('/api/config', {
  params: baseParams.set('details', 'enabled'),
}).subscribe(config => {
  // ...
});

```

⚠️ **IMPORTANTE**: Las instancias de `HttpParams` son **inmutables**, por lo que **no se modifican directamente**.

Métodos como `.set()` o `.append()` devuelven **una nueva instancia** con la mutación aplicada.

También puedes crear `HttpParams` con un `HttpParameterCodec` personalizado si necesitas definir cómo codificar los parámetros en la URL.

---

## 📬 Establecer cabeceras (Setting request headers)

Puedes incluir cabeceras HTTP personalizadas en la solicitud usando la opción `headers`.

✅ Usar un objeto literal es lo más sencillo:

```tsx

http.get('/api/config', {
  headers: {
    'X-Debug-Level': 'verbose',
  }
}).subscribe(config => {
  // ...
});

```

🔧 También puedes usar una instancia de `HttpHeaders` para más control:

```tsx

const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http.get<Config>('/api/config', {
  headers: baseHeaders.set('X-Debug-Level', 'verbose'),
}).subscribe(config => {
  // ...
});

```

⚠️ **IMPORTANTE**: Las instancias de `HttpHeaders` también son **inmutables**.

Los métodos como `.set()` o `.append()` devuelven una **nueva instancia**.

---

## 📡 Interactuar con eventos de respuesta (Interacting with the server response events)

Por conveniencia, `HttpClient` devuelve por defecto un `Observable` de los **datos del cuerpo de la respuesta**.

Pero a veces puede ser útil acceder a la respuesta completa, por ejemplo, para leer cabeceras específicas o el estado HTTP.

Para acceder a la respuesta completa, usa `observe: 'response'`:

```tsx

http.get<Config>('/api/config', { observe: 'response' }).subscribe(res => {
  console.log('Estado de la respuesta:', res.status);
  console.log('Cuerpo:', res.body);
});

```

📌 **Valor literal para `observe`**:

Al igual que `responseType`, el valor de `observe` debe ser un **tipo literal** (`'response' as const`) si lo extraes a una variable.

---

## 📈 Recibir eventos de progreso sin procesar (Receiving raw progress events)

Además del cuerpo de la respuesta o el objeto de respuesta completo, `HttpClient` también puede devolver un **flujo de eventos** (`Observable`) que representa distintos momentos del ciclo de vida de la solicitud.

Estos eventos incluyen:

- cuando la solicitud se envía,
- cuando se recibe la cabecera de la respuesta,
- cuando se completa el cuerpo de la respuesta,
- y también eventos de progreso (upload/download), útiles para archivos grandes.

📉 Los eventos de progreso están **desactivados por defecto**, ya que tienen un coste en rendimiento, pero se pueden habilitar con `reportProgress: true`.

> NOTA: La implementación opcional de HttpClient con fetch no informa sobre eventos de progreso de subida.
> 

Ejemplo observando la secuencia de eventos:

```tsx

http.post('/api/upload', myData, {
  reportProgress: true,
  observe: 'events',
}).subscribe(event => {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      console.log('Subidos ' + event.loaded + ' de ' + event.total + ' bytes');
      break;
    case HttpEventType.Response:
      console.log('¡Carga completada!');
      break;
  }
});

```

📌 **Valor literal para `observe`**:

Al igual que en otros casos, si el objeto de opciones se extrae a una variable, asegúrate de declarar `observe: 'events' as const`.

### Tipos de eventos (`HttpEventType`):

| `type` value | Significado del evento |
| --- | --- |
| `HttpEventType.Sent` | La solicitud ha sido enviada al servidor |
| `HttpEventType.UploadProgress` | Progreso de la subida del cuerpo de la solicitud |
| `HttpEventType.ResponseHeader` | Se ha recibido la cabecera de la respuesta |
| `HttpEventType.DownloadProgress` | Progreso de la descarga del cuerpo de la respuesta |
| `HttpEventType.Response` | Se ha recibido toda la respuesta (incluido el cuerpo) |
| `HttpEventType.User` | Evento personalizado generado desde un interceptor HTTP |

---

## 🚨 Manejar errores de la solicitud (Handling request failure)

Una solicitud HTTP puede fallar de tres formas:

1. ❌ **Error de red/conexión**: la petición no llega al servidor.
2. 🕒 **Timeout**: la solicitud no se completa en el tiempo establecido.
3. 🧱 **Error del servidor**: la solicitud llega, pero el servidor responde con un error.

Angular encapsula estos errores en un objeto `HttpErrorResponse` que es emitido a través del canal `error` del `Observable`.

Detalles:

- Errores de red y de timeout tienen **status 0** y un `error` que es una instancia de `ProgressEvent`.
- Errores del servidor tienen un **status code real** y el cuerpo de error como `error`.

### 🔧 Manejo de errores con operadores de RxJS

Puedes usar operadores como `catchError` para transformar un error en un valor que la UI pueda manejar:

```tsx

http.get('/api/data').pipe(
  catchError(error => {
    // Mostrar error o retornar valor alternativo
    return of(null);
  })
).subscribe(data => {
  if (!data) {
    console.error('La solicitud falló.');
  }
});

```

🌀 También puedes usar operadores de **reintento automático** como `retry()` para volver a intentar solicitudes que fallan de forma transitoria:

```tsx

http.get('/api/data').pipe(
  retry(3)
).subscribe(...);

```

---

## ⏱️ Tiempos de espera (Timeouts)

Para establecer un límite de tiempo para una solicitud, puedes usar la opción `timeout`, que se indica en milisegundos junto con otras opciones de la solicitud.

Si la solicitud no se completa dentro del tiempo especificado, se abortará y se emitirá un error.

```tsx

http.get('/api/config', {
  timeout: 3000, // 3 segundos
}).subscribe({
  next: config => {
    console.log('Configuración obtenida correctamente:', config);
  },
  error: err => {
    console.error('Se alcanzó el tiempo de espera.');
  }
});

```

📌 **NOTA**:

El timeout se aplica **solo** a la petición HTTP al backend.

No afecta al procesamiento posterior ni a retrasos causados por interceptores.

---

## 🚀 Opciones avanzadas de `fetch` (Advanced fetch options)

Cuando usas el proveedor `withFetch()`, `HttpClient` te da acceso a **opciones avanzadas de la API `fetch`**, que pueden mejorar el rendimiento y la experiencia del usuario.

Estas opciones **solo están disponibles si usas `fetch` como backend**.

---

### ⚙️ Opciones de `fetch` (Fetch options)

Estas opciones permiten un control más detallado del comportamiento de las solicitudes.

---

### 🔁 Conexiones persistentes (`keepalive`)

La opción `keepalive` permite que una solicitud **siga viva** incluso si el usuario navega fuera de la página actual.

Esto es útil para **analytics** o **logs** que deben completarse aunque el usuario cierre la pestaña.

```tsx

http.post('/api/analytics', analyticsData, {
  keepalive: true
}).subscribe();

```

---

### 🗃️ Control de caché HTTP (`cache`)

La opción `cache` determina cómo interactúa la solicitud con la caché HTTP del navegador.

```tsx

// Usa respuesta en caché aunque esté desactualizada
http.get('/api/config', {
  cache: 'force-cache'
}).subscribe(config => {});

// Siempre busca en red, ignora la caché
http.get('/api/live-data', {
  cache: 'no-cache'
}).subscribe(data => {});

// Solo usa la caché, falla si no está en caché
http.get('/api/static-data', {
  cache: 'only-if-cached'
}).subscribe(data => {});

```

---

### 📊 Prioridad de las solicitudes (`priority`)

Esta opción indica la **importancia relativa** de una solicitud, ayudando al navegador a optimizar la carga de recursos.

```tsx

// Alta prioridad para datos críticos
http.get('/api/user-profile', {
  priority: 'high'
}).subscribe(profile => {});

// Baja prioridad para recomendaciones o análisis
http.get('/api/recommendations', {
  priority: 'low'
}).subscribe(recommendations => {});

// Prioridad automática (por defecto)
http.get('/api/settings', {
  priority: 'auto'
}).subscribe(settings => {});

```

Valores disponibles:

- `'high'`: Alta prioridad (ej. datos del usuario o contenido visible al cargar).
- `'low'`: Baja prioridad (ej. analíticas o precarga).
- `'auto'`: El navegador decide según el contexto.

💡 **TIP**: Usa `'high'` para recursos que impactan el **Largest Contentful Paint (LCP)** y `'low'` para los que no afectan la carga inicial.

---

## 🌐 Modo de la solicitud (`mode`)

La opción `mode` determina cómo se gestionan las solicitudes **entre orígenes (CORS)** y qué tipo de respuesta se puede recibir.

```tsx

// Solo permite solicitudes al mismo origen
http.get('/api/local-data', {
  mode: 'same-origin'
}).subscribe(data => {});

// Permite solicitudes entre orígenes con CORS
http.get('https://api.external.com/data', {
  mode: 'cors'
}).subscribe(data => {});

// Permite solicitudes simples entre orígenes, respuesta opaca
http.get('https://external-api.com/public-data', {
  mode: 'no-cors'
}).subscribe(data => {});

```

📌 Valores disponibles:

| Valor | Descripción |
| --- | --- |
| `'same-origin'` | Solo permite solicitudes al mismo dominio. Fallará si el origen es diferente. |
| `'cors'` | Permite solicitudes CORS entre dominios distintos (por defecto). |
| `'no-cors'` | Permite solicitudes entre orígenes sin CORS, pero la respuesta es opaca. |

💡 **TIP**: Usa `mode: 'same-origin'` para solicitudes sensibles que nunca deben ir a otros dominios.

---

## 🔁 Manejo de redirecciones (`redirect`)

La opción `redirect` especifica cómo se deben tratar las respuestas de redirección del servidor.

```tsx

// Seguir automáticamente redirecciones (comportamiento por defecto)
http.get('/api/resource', {
  redirect: 'follow'
}).subscribe(data => {});

// No seguir redirecciones automáticamente
http.get('/api/resource', {
  redirect: 'manual'
}).subscribe(response => {
  // gestionar la redirección manualmente
});

// Tratar las redirecciones como errores
http.get('/api/resource', {
  redirect: 'error'
}).subscribe({
  next: data => {
    // Respuesta correcta
  },
  error: err => {
    // Redirecciones activan este handler
  }
});

```

📌 Valores disponibles:

| Valor | Descripción |
| --- | --- |
| `'follow'` | Sigue redirecciones automáticamente (por defecto). |
| `'error'` | Trata cualquier redirección como un error. |
| `'manual'` | No sigue redirecciones, devuelve la respuesta tal cual. |

💡 **TIP**: Usa `redirect: 'manual'` si necesitas manejar la lógica de redirección tú mismo.

---

## 🔐 Manejo de credenciales (`credentials`)

La opción `credentials` controla si se deben enviar **cookies, cabeceras de autorización y otras credenciales** con las solicitudes entre orígenes.

```tsx

// Incluir credenciales en solicitudes entre dominios
http.get('https://api.example.com/protected-data', {
  credentials: 'include'
}).subscribe(data => {});

// Nunca enviar credenciales (valor por defecto en cross-origin)
http.get('https://api.example.com/public-data', {
  credentials: 'omit'
}).subscribe(data => {});

// Solo enviar credenciales en solicitudes al mismo origen
http.get('/api/user-data', {
  credentials: 'same-origin'
}).subscribe(data => {});

```

🧭 Además, puedes sobrescribir `credentials` usando la opción `withCredentials: true`:

```tsx

http.get('https://api.example.com/data', {
  credentials: 'omit',        // Este será ignorado
  withCredentials: true       // Fuerza credentials: 'include'
}).subscribe(data => {
  // Las credenciales se incluirán igualmente
});

```

También puedes usar el enfoque clásico:

```tsx

http.get('https://api.example.com/data', {
  withCredentials: true
}).subscribe(data => {
  // Equivale a credentials: 'include'
});

```

⚠️ **IMPORTANTE**:

La opción `withCredentials` **tiene prioridad sobre** `credentials`.

Si ambas se definen, `withCredentials: true` **forzará** el valor `credentials: 'include'`.

📌 Valores válidos para `credentials`:

| Valor | Descripción |
| --- | --- |
| `'omit'` | Nunca enviar credenciales |
| `'same-origin'` | Solo para solicitudes al mismo origen (por defecto en CORS) |
| `'include'` | Siempre enviar credenciales, incluso entre dominios |

💡 **TIP**: Usa `'include'` cuando necesites enviar cookies de autenticación o cabeceras a un dominio diferente que admita CORS.

Evita mezclar `credentials` y `withCredentials` para no crear confusión.

---

## 📡 Observables de HttpClient (Http Observables)

Cada método de `HttpClient` construye y devuelve un **Observable** del tipo de respuesta solicitado.

Entender cómo funcionan estos Observables es clave para trabajar correctamente con `HttpClient`.

### 🧊 “Cold” Observables

Los Observables de `HttpClient` son lo que RxJS llama **"cold"** (fríos), lo que significa que **no se ejecutan hasta que te suscribes**.

```tsx

const obs$ = http.get('/api/data'); // no hace nada aún

obs$.subscribe(data => {
  // aquí sí se lanza la petición al servidor
});

```

🌀 Cada vez que te suscribes, **se hace una nueva petición**. Las suscripciones son independientes.

💡 **TIP**: Piensa en los Observables de `HttpClient` como *planos de construcción* de peticiones HTTP reales.

---

### ❌ Cancelación de solicitudes

Al **cancelar una suscripción**, se aborta automáticamente la solicitud en curso.

Esto es útil con el *pipe async* en Angular, ya que **cancela** automáticamente si el usuario cambia de vista o componente.

También pasa si usas operadores como `switchMap`, que cancelan solicitudes anteriores:

```tsx

this.userId$.pipe(
  switchMap(id => this.http.get(`/api/user/${id}`))
).subscribe(...);

```

🔒 **Una vez completada la respuesta**, el Observable se completa.

Aunque los interceptores pueden modificar este comportamiento, por defecto **no hay riesgo de fugas de memoria**.

Aun así, **se recomienda limpiar las suscripciones manualmente** si no usas `async` ni `toSignal`, para evitar errores en callbacks que se disparen tras destruir el componente.

💡 **TIP**: Usa el `async` pipe o `toSignal()` para asegurarte de que las suscripciones se cancelan correctamente.

---

## 🧠 Buenas prácticas (Best practices)

Aunque puedes inyectar `HttpClient` directamente en componentes, **es preferible usar servicios inyectables reutilizables** que encapsulen la lógica de acceso a datos.

Por ejemplo, este `UserService` gestiona cómo obtener los datos de un usuario:

```tsx

@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}

```

En un componente puedes combinar `@if` con el pipe `async` para mostrar datos cuando estén disponibles:

```tsx

import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Nombre: {{ user.name }}</p>
      <p>Biografía: {{ user.biography }}</p>
    }
  `,
})
export class UserProfileComponent {
  userId = input.required<string>();
  user$!: Observable<User>;
  private userService = inject(UserService);

  constructor(): void {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}

```