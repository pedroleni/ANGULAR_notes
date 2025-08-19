# Primer  componente Contador tradicional → standalone: false

### Paso 1: Generar el Componente

Primero, genera el componente usando Angular CLI:

```bash

ng generate component contador

```

### Paso 2: Implementar la Lógica del Componente

Abre el archivo `contador.component.ts` y añade la lógica del contador:

```tsx

import { Component } from '@angular/core';

@Component({
  selector: 'app-contador',
  templateUrl: './contador.component.html',
  styleUrls: ['./contador.component.css']
})
export class ContadorComponent {
  contador: number = 0;

  incrementar() {
    this.contador++;
  }

  decrementar() {
    this.contador--;
  }
}

```

### Paso 3: Diseñar la Interfaz del Contador

En el archivo `contador.component.html`, define la interfaz de usuario:

```html

<div class="contador-container">
  <h1>Contador: {{ contador }}</h1>
  <div class="buttons">
    <button (click)="incrementar()">Incrementar</button>
    <button (click)="decrementar()">Decrementar</button>
  </div>
</div>

```

### Paso 4: Agregar Estilos CSS

Abre el archivo `contador.component.css` y añade los siguientes estilos:

```css

.contador-container {
  text-align: center;
  margin-top: 50px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #003f7f;
}

```

### Paso 5: Declarar el Componente en el Módulo

Como el componente no es standalone, debes declararlo en el módulo principal de la aplicación. Abre el archivo `src/app/app.module.ts` y añade `ContadorComponent` a las declaraciones:

```tsx

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ContadorComponent } from './contador/contador.component';

@NgModule({
  declarations: [
    AppComponent,
    ContadorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### Paso 6: Usar el Componente en la Aplicación

Ahora, abre el archivo `app.component.html` y añade el selector del componente:

```html

<app-contador></app-contador>

```

### Paso 7: Ejecutar la Aplicación

Ejecuta la aplicación para ver tu contador estilizado:

```bash

ng serve

```

Visita `http://localhost:4200/` en tu navegador para ver el contador con los estilos aplicados.

### Resumen

Has creado un componente contador en Angular con estilos CSS para que la interfaz sea más atractiva. Este enfoque muestra cómo se puede combinar lógica, HTML y CSS en un componente Angular tradicional, donde el componente debe ser declarado dentro de un módulo (con `standalone: false`). Los botones tienen un estilo básico con un efecto de hover y active para mejorar la experiencia del usuario.

[Grabación de pantalla 2024-08-28 a las 1.37.52.mov](Primer%20componente%20Contador%20tradicional%20%E2%86%92%20standalon%20d4ad9102c8d14fcead732e1c0d8797da/Grabacion_de_pantalla_2024-08-28_a_las_1.37.52.mov)