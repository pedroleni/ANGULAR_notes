# 18. Resources: reactividad asíncrona.

⚠️ **IMPORTANTE**: `resource` es experimental. Está listo para que lo pruebes, pero podría cambiar antes de ser una API estable.

La mayoría de las APIs de `signal` son **sincrónicas** — `signal`, `computed`, `input`, etc. Sin embargo, las aplicaciones a menudo necesitan manejar datos que están disponibles de forma **asíncrona**. Un **Resource** (recurso) te ofrece una forma de incorporar datos asíncronos en el código basado en señales de tu aplicación.

Puedes usar un **Resource** para ejecutar cualquier tipo de operación asíncrona, pero el caso de uso más común es obtener datos desde un servidor. El siguiente ejemplo crea un recurso para obtener datos de un usuario.

La forma más sencilla de crear un recurso es usando la función `resource`:

```tsx

-------------- ANGULAR v20 ----------------------------------
import { resource, Signal } from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Define un cálculo reactivo.
  // El valor de `params` se recalcula cada vez que alguna señal leída cambia.
  params: () => ({ id: userId() }),
  // Define un cargador asíncrono que recupera los datos.
  // El recurso llama a esta función cada vez que el valor de `params` cambia.
  loader: ({ params }) => fetchUser(params),
});

// Crea una señal computada basada en el resultado de la función `loader` del recurso.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` cumple dos funciones:
    // - Actúa como guarda de tipo, eliminando `undefined` del tipo
    // - Protege contra leer un valor que lanzaría error si el recurso está en estado de error
    return userResource.value().firstName;
  }
  // Valor alternativo en caso de que el recurso esté en estado de error o `undefined`
  return undefined;
});

```

La función `resource` acepta un objeto `ResourceOptions` con dos propiedades principales: `params` y `loader`.

- La propiedad `params` define un cálculo reactivo que produce un valor de parámetro. Cada vez que cambian las señales leídas en este cálculo, el recurso produce un nuevo valor de parámetro, similar a `computed`.
- La propiedad `loader` define un `ResourceLoader`: una función asíncrona que obtiene algún estado. El recurso llama al `loader` cada vez que el cálculo `params` produce un nuevo valor, pasándole ese valor al `loader`. (Ver más abajo en **Resource loaders** para más detalles).

El recurso tiene una señal `value` que contiene los resultados del `loader`.

---

## Cargadores de recursos (Resource loaders)

Al crear un recurso, defines un **ResourceLoader**. Este loader es una función `async` que acepta un único parámetro: un objeto `ResourceLoaderParams`, y retorna un valor.

El objeto `ResourceLoaderParams` contiene tres propiedades:

| Propiedad | Descripción |
| --- | --- |
| `params` | El valor del cálculo `params` del recurso. |
| `previous` | Un objeto con una propiedad `status` que contiene el estado anterior. |
| `abortSignal` | Un `AbortSignal`. Ver más abajo en “**Aborting requests**” para más detalles. |

Si el cálculo `params` devuelve `undefined`, la función `loader` **no se ejecuta** y el estado del recurso pasa a ser `'idle'`.

---

## Cancelación de peticiones (Aborting requests)

Un recurso cancela una operación de carga pendiente si el cálculo `params` cambia mientras el recurso aún está cargando.

Puedes usar la propiedad `abortSignal` de `ResourceLoaderParams` para responder a las solicitudes abortadas.

Por ejemplo, la función nativa `fetch` acepta una señal de cancelación (`AbortSignal`):

```tsx

const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({ id: userId() }),
  loader: ({ params, abortSignal }): Promise<User> => {
    // `fetch` cancela cualquier petición HTTP pendiente cuando
    // la señal `abortSignal` indica que la solicitud ha sido abortada.
    return fetch(`users/${params.id}`, { signal: abortSignal });
  },
});

```

Consulta la documentación de `AbortSignal` en MDN para más información sobre la cancelación de solicitudes.

---

## Recarga manual (Reloading)

Puedes activar manualmente el cargador de un recurso llamando al método `reload`.

```tsx
ts
CopiarEditar
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({ id: userId() }),
  loader: ({ params }) => fetchUser(params),
});

// ...
userResource.reload();

```

---

## Estado del recurso (Resource status)

El objeto del recurso tiene varias propiedades tipo `signal` para leer el estado del cargador asíncrono.

| Propiedad | Descripción |
| --- | --- |
| `value` | El valor más reciente del recurso, o `undefined` si no se ha recibido valor. |
| `hasValue` | Indica si el recurso tiene un valor. |
| `error` | El error más reciente al ejecutar el `loader`, o `undefined` si no hubo error. |
| `isLoading` | Indica si el `loader` se está ejecutando actualmente. |
| `status` | El `ResourceStatus` específico del recurso, explicado más abajo. |

La señal `status` proporciona un `ResourceStatus` que describe el estado del recurso mediante constantes tipo string:

| `status` | `value()` | Descripción |
| --- | --- | --- |
| `'idle'` | `undefined` | El recurso no tiene solicitud válida y el `loader` no ha sido ejecutado. |
| `'error'` | `undefined` | El `loader` encontró un error. |
| `'loading'` | `undefined` | El `loader` se está ejecutando debido a un cambio en el valor de `params`. |
| `'reloading'` | Valor anterior | El `loader` se ejecuta tras llamar manualmente a `reload()`. |
| `'resolved'` | Valor resuelto | El `loader` ha finalizado correctamente. |
| `'local'` | Valor local | El valor del recurso fue establecido manualmente mediante `.set()` o `.update()`. |

Puedes usar esta información de estado para mostrar condicionalmente elementos de UI, como indicadores de carga o mensajes de error.

---

## Obtención reactiva de datos con `httpResource`

`httpResource` es un envoltorio sobre `HttpClient` que te proporciona el **estado de la solicitud** y la **respuesta** como señales (`signals`). Realiza las solicitudes HTTP a través del stack HTTP de Angular, incluyendo los interceptores.

---

## Cambios de resource en la v19 - v20

El **cambio de `resource` de Angular 16/17/18/19 a Angular 20** ha introducido algunos **ajustes importantes** en su sintaxis y comportamiento, ya que sigue siendo una API **experimental**, pero más madura en Angular 20.

A continuación te explico los **cambios clave entre Angular 19 y 20** para `resource`, con ejemplos comparativos:

---

## ✅ 1. **El API `resource()` en Angular 19:**

En Angular 19, usabas:

```tsx

const userResource = resource({
  params: () => ({ id: userId() }),
  loader: ({ params }) => fetchUser(params),
});

```

---

## ✅ 2. **El API `resource()` en Angular 20:**

En Angular 20, **el API se mantiene casi igual**, pero ahora es **más estricta con los tipos** y se ha mejorado la **gestión del estado anterior**, abortos y recarga. Además, se enfatiza el uso de **tipado genérico** para recursos.

### 🔹 Cambio clave: uso explícito de tipos

Ahora se recomienda (y a veces es necesario) declarar explícitamente los tipos del parámetro, del resultado y del estado anterior:

```tsx

const userResource = resource<{ id: string }, User>({
  params: () => ({ id: userId() }),
  loader: async ({ params, abortSignal, previous }) => {
    const response = await fetch(`users/${params.id}`, { signal: abortSignal });
    return await response.json();
  },
});

```

---

## 🆕 Cambios específicos en Angular 20

### 1. ✅ **Soporte más formal para `previous`**

El parámetro `previous` se puede usar de forma más consistente, y tiene un tipo bien definido con acceso a `status`, `value`, etc.

### 2. ✅ **Mayor control con `status` y `reload()`**

El `.reload()` ahora es más robusto, y puedes usar el `status` con más precisión (`idle`, `loading`, `resolved`, `reloading`, `error`, `local`).

### 3. ✅ **Se soporta mejor `undefined` en params**

Si `params()` devuelve `undefined`, el recurso no se ejecuta. Esto sigue igual, pero está mejor documentado y es más seguro.

### 4. ✅ **`httpResource` se integra mejor con interceptores y estados HTTP**

Aunque `httpResource` ya existía, en Angular 20 está más integrado con el stack de `HttpClient`, usando `HttpContextToken`, etc.

---

## 🔄 Comparación rápida

| Característica | Angular 19 | Angular 20 |
| --- | --- | --- |
| Tipado genérico | Opcional | Recomendado o requerido en muchos casos |
| `abortSignal` | Estaba disponible | Sigue igual, pero más documentado |
| `previous.status` | Básico | Mejor tipado y más útil |
| Control de recarga (`reload`) | Manual | Igual, pero más claro con estados |
| Integración con `HttpClient` | Básica vía `httpResource` | Mejor integración con interceptores |
| API estable | ❌ Experimental | ❌ Sigue siendo experimental (pero madura) |

---

## 🧪 Ejemplo completo en Angular 20

```tsx

const userId = signal('123');

interface User {
  id: string;
  name: string;
}

const userResource = resource<{ id: string }, User>({
  params: () => ({ id: userId() }),
  loader: async ({ params, abortSignal, previous }) => {
    const response = await fetch(`/api/users/${params.id}`, {
      signal: abortSignal,
    });

    if (!response.ok) throw new Error('Error fetching user');
    return response.json();
  },
});

```

Y puedes usarlo así:

```tsx
ts
CopiarEditar
if (userResource.status() === 'loading') {
  // mostrar spinner
}
if (userResource.hasValue()) {
  console.log(userResource.value().name);
}

```

## 💡 Proyecto ejemplo con v19

[rx source paises app v19.zip](18%20Resources%20reactividad%20as%C3%ADncrona%202302f387d5c380b399fcc8a9a7d175f6/rx_source_paises_app_v19.zip)

## 💡Proyecto ejemplo con v20

[rx source paises app v20.zip](18%20Resources%20reactividad%20as%C3%ADncrona%202302f387d5c380b399fcc8a9a7d175f6/rx_source_paises_app_v20.zip)

Tener cuidado porque de la v19 a v20 veréis una diferencia en que el resource lo utiliza y luego envía la info de los estado a componente de la lista de paises en la v19 y en cambio en la v20 esto no funciona bien, ya que hay que enviar el objeto entero de resource para que se pueda leer los signal correctamente. 

v19

```html
<country-search-input
  placeholder="Buscar por capital"
  (value)="query.set($event)"
  [debounceTime]="300"
  [initialValue]="query()"
/>

<country-list
  [countries]="countryResource.value() ?? []"
  [errorMessage]="countryResource.error()"
  [isEmpty]="countryResource.value()?.length === 0"
  [isLoading]="countryResource.isLoading()"
/>

```

v20

```html
<country-search-input
  placeholder="Buscar por capital"
  (value)="query.set($event)"
  [debounceTime]="300"
  [initialValue]="query()"
/>

<country-list [countries]="countryResource" />

```