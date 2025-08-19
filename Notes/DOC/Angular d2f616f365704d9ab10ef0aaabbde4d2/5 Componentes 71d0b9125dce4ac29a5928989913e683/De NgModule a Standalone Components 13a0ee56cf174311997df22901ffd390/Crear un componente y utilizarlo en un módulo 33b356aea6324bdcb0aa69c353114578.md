# Crear un componente y utilizarlo en un módulo

Crear un componente en Angular de la forma tradicional implica utilizar Angular CLI para generar el componente y luego declararlo en el módulo correspondiente. A continuación, te guiaré paso a paso en el proceso.

### Paso 1: Generar el Componente con Angular CLI

Primero, asegúrate de que estás en la raíz de tu proyecto Angular y luego utiliza Angular CLI para generar el nuevo componente. Ejecuta el siguiente comando en tu terminal:

```bash

ng generate component nombre-del-componente

```

o su forma abreviada:

```bash

ng g c nombre-del-componente

```

Reemplaza `nombre-del-componente` con el nombre que desees para tu componente. Por ejemplo, si quieres crear un componente llamado `mi-componente`, ejecutarías:

```bash

ng generate component mi-componente

```

### Paso 2: Revisión de Archivos Generados

Angular CLI generará automáticamente una carpeta con los siguientes archivos dentro de `src/app/mi-componente/`:

1. **`mi-componente.component.ts`**: Contiene la lógica del componente, donde defines las propiedades, métodos, y dependencias del componente.
2. **`mi-componente.component.html`**: Es la plantilla HTML del componente, donde defines la estructura y el contenido visual.
3. **`mi-componente.component.css`**: Archivo de estilos CSS específico para el componente.
4. **`mi-componente.component.spec.ts`**: Archivo para pruebas unitarias del componente. Este archivo es utilizado para realizar tests automáticos.

### Paso 3: Declarar el Componente en un Módulo

El siguiente paso es declarar el componente en el módulo correspondiente. Normalmente, lo declararás en el módulo principal `AppModule`. Abre el archivo `src/app/app.module.ts` y agrega el componente en la sección `declarations`.

```tsx

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MiComponenteComponent } from './mi-componente/mi-componente.component'; // Importa el nuevo componente

@NgModule({
  declarations: [
    AppComponent,
    MiComponenteComponent // Declara el componente aquí
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### Paso 4: Usar el Componente en la Aplicación

Para utilizar el nuevo componente, inserta su selector en el archivo `app.component.html` o en cualquier otro archivo de plantilla de Angular. El selector del componente se define en el archivo `mi-componente.component.ts` dentro del decorador `@Component`. Por ejemplo, si el selector es `app-mi-componente`, puedes usarlo así:

```html

<app-mi-componente></app-mi-componente>

```

### Paso 5: Ejecutar la Aplicación

Finalmente, ejecuta la aplicación para ver el nuevo componente en acción:

```bash

ng serve

```

Visita `http://localhost:4200/` en tu navegador para ver la aplicación con el nuevo componente.

### Resumen

Has creado un componente en Angular de la forma tradicional. Este componente ha sido generado utilizando Angular CLI, declarado en un módulo (`AppModule`), y se puede utilizar en cualquier plantilla de Angular mediante su selector. Esta es la forma estándar y más común de trabajar con componentes en Angular.