# Configuración de HttpClient

### Antes de poder usar `HttpClient` en tu aplicación, debes configurarlo mediante inyección de dependencias.

---

### Proveer `HttpClient` mediante inyección de dependencias

`HttpClient` se proporciona usando la función auxiliar `provideHttpClient`, que la mayoría de las aplicaciones incluye en los proveedores de la aplicación en `app.config.ts`:

```tsx

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ]
};

```

✅ **Nota:** Si tu aplicación utiliza un arranque basado en `NgModule`, también puedes incluir `provideHttpClient` en los proveedores del `NgModule` de tu aplicación:

```tsx

@NgModule({
  providers: [
    provideHttpClient(),
  ],
  // ... otra configuración de la aplicación
})
export class AppModule {}

```

Una vez hecho esto, puedes inyectar el servicio `HttpClient` como dependencia en tus componentes, servicios u otras clases:

```tsx

@Injectable({providedIn: 'root'})
export class ConfigService {
  private http = inject(HttpClient);
  // Este servicio ya puede hacer peticiones HTTP mediante `this.http`.
}

```

---

### Configurar funcionalidades de `HttpClient`

`provideHttpClient` acepta una lista de configuraciones opcionales que habilitan o ajustan el comportamiento del cliente. A continuación se explican las opciones disponibles:

---

### `withFetch()`

```tsx

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
    ),
  ]
};

```

✅ Por defecto, `HttpClient` utiliza la API `XMLHttpRequest` para hacer peticiones.

`withFetch` cambia el cliente para que use la API `fetch` en su lugar.

ℹ️ `fetch` es una API más moderna y está disponible en algunos entornos donde no lo está `XMLHttpRequest`.

Tiene limitaciones, como no soportar eventos de progreso de subida.

---

### `withInterceptors(...)`

Configura el conjunto de funciones interceptoras que procesarán las peticiones hechas a través de `HttpClient`.

Consulta la guía de interceptores para más información.

---

### `withInterceptorsFromDi()`

Incluye el estilo antiguo de interceptores basados en clases en la configuración de `HttpClient`.

Consulta la guía de interceptores para más información.

🟢 **RECOMENDADO:** Los interceptores funcionales (vía `withInterceptors`) tienen un orden más predecible y se recomienda usarlos sobre los basados en DI.

---

### `withRequestsMadeViaParent()`

Por defecto, cuando configuras `HttpClient` usando `provideHttpClient` en un inyector, esta configuración **sobrescribe** cualquier configuración del `HttpClient` presente en el inyector padre.

Si añades `withRequestsMadeViaParent()`, `HttpClient` se configurará para enviar las peticiones al `HttpClient` del inyector padre, **una vez hayan pasado por los interceptores definidos a este nivel**.

🧠 Útil si quieres añadir interceptores en un inyector hijo, pero seguir utilizando los interceptores del padre.

⚠️ **CRÍTICA:** Debe existir una instancia de `HttpClient` en un inyector superior. De lo contrario, obtendrás un **error en tiempo de ejecución**.

---

### `withJsonpSupport()`

Habilita el método `.jsonp()` en `HttpClient`, el cual realiza una petición GET usando el convenio JSONP para cargar datos desde otros dominios.

💡 Siempre que sea posible, **prefiere usar CORS** en vez de JSONP para solicitudes entre dominios.

---

### `withXsrfConfiguration(...)`

Permite personalizar la funcionalidad de seguridad XSRF integrada en `HttpClient`.

Consulta la guía de seguridad para más detalles.

---

### `withNoXsrfProtection()`

Desactiva la funcionalidad de seguridad XSRF integrada en `HttpClient`.

Consulta la guía de seguridad para más detalles.

---

### Configuración basada en `HttpClientModule`

Algunas aplicaciones siguen configurando `HttpClient` mediante la API antigua basada en `NgModules`.

Esta tabla muestra los `NgModules` disponibles en `@angular/common/http` y su equivalencia con las funciones modernas de configuración:

| NgModule | Equivalente `provideHttpClient()` |
| --- | --- |
| `HttpClientModule` | `provideHttpClient(withInterceptorsFromDi())` |
| `HttpClientJsonpModule` | `withJsonpSupport()` |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)` |
| `HttpClientXsrfModule.disable()` | `withNoXsrfProtection()` |