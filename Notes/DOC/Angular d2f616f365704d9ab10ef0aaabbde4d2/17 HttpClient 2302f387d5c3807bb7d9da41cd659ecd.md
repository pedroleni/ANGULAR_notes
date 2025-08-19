# 17. HttpClient

[**Configuración de HttpClient**
](17%20HttpClient%202302f387d5c3807bb7d9da41cd659ecd/Configuraci%C3%B3n%20de%20HttpClient%202432f387d5c380c0b216df4c84ce5751.md)

[Realizar peticiones HTTP](17%20HttpClient%202302f387d5c3807bb7d9da41cd659ecd/Realizar%20peticiones%20HTTP%202432f387d5c3808a946ccbcf2a443783.md)

[Obtención reactiva de datos](17%20HttpClient%202302f387d5c3807bb7d9da41cd659ecd/Obtenci%C3%B3n%20reactiva%20de%20datos%202432f387d5c380ce83e6f7fa21caa9f4.md)

[Interceptores](17%20HttpClient%202302f387d5c3807bb7d9da41cd659ecd/Interceptores%202432f387d5c380238f54efab2ec4045d.md)

[Test de peticiones](17%20HttpClient%202302f387d5c3807bb7d9da41cd659ecd/Test%20de%20peticiones%202432f387d5c3805c8d12f73bd9053e6f.md)

## 🚀 HttpClient en Angular (versión moderna, Angular ≥ 17)

### 📌 Qué es HttpClient

`HttpClient` es el servicio integrado en `@angular/common/http` para interactuar con APIs remoto de forma HTTP. Permite:

- Realizar peticiones (`GET`, `POST`, `PUT`, etc.) y obtener respuestas tipadas.
- Integrar interceptores para manipular solicitudes y respuestas.
- Manejar errores de forma elegante con RxJS.
- Testear peticiones de forma eficiente gracias a herramientas dedicadas.
    
    [v17.angular.io](https://v17.angular.io/guide/http-request-data-from-server?utm_source=chatgpt.com)[Telerik.com+6angular.dev+6This Dot Labs+6](https://angular.dev/guide/http?utm_source=chatgpt.com)
    

---

## ⚙️ Configuración moderna

Desde Angular 15 (y oficializado en Angular ≥ 17), ya no necesitas importar `HttpClientModule`. Se usa `provideHttpClient()` en la configuración del bootstrap:

```tsx

import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],
});

```

Esto simplifica la integración y mejora la capacidad de tree-shaking.

[itsolutionstuff.com+2Stack Overflow+2ANGULARarchitects+2](https://stackoverflow.com/questions/78430636/httpclientmodule-is-deprecated-in-angular-18-whats-the-replacement?utm_source=chatgpt.com)

---

## 🧩 Usar HttpClient con servicios

Ejemplo para hacer peticiones usando un servicio inyectable:

```tsx

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>('/api/movies');
  }
}

```

- Inyectas `HttpClient` en el servicio.
- Definimos la respuesta esperada con tipos genéricos (`<Movie[]>`).
    
    [Telerik.com+10This Dot Labs+10Stack Overflow+10](https://www.thisdot.co/blog/using-httpclient-in-modern-angular-applications?utm_source=chatgpt.com)[Angular University](https://blog.angular-university.io/angular-http/?utm_source=chatgpt.com)
    

---

## 📡 Realizar peticiones HTTP

`HttpClient` soporta todos los verbos HTTP, y devuelve observables típicamente de tipo JSON. Ejemplos:

```tsx

this.http.get<Movie>(url);
this.http.post<Config>(url, body);
this.http.put(url, data);
this.http.delete(url);

```

- Si no especificas tipo genérico, se usa `Object` como predeterminado.
- Puedes ajustar opciones como cabeceras, parámetros, `responseType`, `observe`, `params`, `cache`, `mode`, `priority`, y más.
    
    [Medium+6Telerik.com+6GeeksforGeeks+6](https://www.telerik.com/blogs/angular-basics-how-to-use-httpclient?utm_source=chatgpt.com)[Angular University](https://blog.angular-university.io/angular-http/?utm_source=chatgpt.com)[angular.dev](https://angular.dev/api/common/http/HttpClient?utm_source=chatgpt.com)
    

---

## 🧪 Manejo de errores y seguridad

Con operadores RxJS puedes capturar errores:

```tsx

this.http.get('/api/data').pipe(
  catchError(error => of(null))
).subscribe();

```

También puedes usar operadores como `retry()` para manejar reintentos automáticos.

[Angular University+9Medium+9GeeksforGeeks+9](https://medium.com/the-60-second-programmer/using-angulars-httpclient-for-api-requests-9c02d80cf7d1?utm_source=chatgpt.com)[Telerik.com](https://www.telerik.com/blogs/angular-basics-how-to-use-httpclient?utm_source=chatgpt.com)

---

## 🌐 Parámetros y cabeceras

- `HttpParams` y `HttpHeaders` son **inmutables**. Cada método `.set()` devuelve una nueva instancia.
- Consulta actualizada: parámetros de URL se configuran con `HttpParams`, y cabeceras con `HttpHeaders` o literales.

---

## ♻️ Observables: son "cold" y cancelables

- Las peticiones solo se envían cuando te suscribes (`.subscribe()`).
- Varias suscripciones generan múltiples llamadas HTTP.
- Al cancelar la suscripción (`unsubscribe()`), se aborta la petición activa.
- El uso de `async pipe` o `toSignal()` ayuda a evitar fugas de memoria.
    
    [Angular University](https://blog.angular-university.io/angular-http/?utm_source=chatgpt.com)
    

---

## ⚙️ Functional interceptors y `withFetch`

Angular moderno recomienda usar **interceptores funcionales**, que son funciones puras (no clases). Además puedes habilitar `withFetch()` para usar la API `fetch` en lugar de `XHR`.

[Stack Overflow](https://stackoverflow.com/questions/78430636/httpclientmodule-is-deprecated-in-angular-18-whats-the-replacement?utm_source=chatgpt.com)

```tsx

loginInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ headers: req.headers.set('Auth', 'token') }));
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch(), withInterceptors([loginInterceptor]))
  ]
});

```

---

## ✅ Buenas prácticas

- Principalmente usa servicios inyectables para alojar lógica HTTP.
- Usa genéricos para tipar respuestas (`get<User[]>`).
- Maneja errores con operadores (`catchError`, `retry`).
- Utiliza `async` o `toSignal()` en componentes para gestionar peticiones reactivas.
- Configura interceptores funcionales con `withInterceptors`.

---

### 📊 Tabla comparativa rápida

| Aspecto | Versión moderna Angular ≥ 17 |
| --- | --- |
| **Importación básica** | `provideHttpClient()` en `bootstrapApplication()` |
| **Interceptores** | Funcionales con `withInterceptors()` |
| **Backend HTTP** | `HttpClient` + RxJS (`cold Observable`) |
| **Mutabilidad** | `HttpParams`, `HttpHeaders` son inmutables |
| **Cancelación automática** | `async pipe` o `toSignal()` cancelan suscripciones automáticamente |
| **Seguridad** | `catchError`, `retry()` para errores |
| **Cantidad de código** | SDK más ligero y modular, mejor para tree-shaking |