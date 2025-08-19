# Probando nuestro primer proyecto

Ahora en el proyecto que hemos creado anteriormente, veremos en `src` una carpeta llamada `app` donde veremos el contenido de nuestra app

![Captura de pantalla 2024-03-06 a las 17.54.42.png](Probando%20nuestro%20primer%20proyecto%2024b2f387d5c380c1b09bd85ba43b3716/Captura_de_pantalla_2024-03-06_a_las_17.54.42.png)

Tendremos tres archivos principales donde podemos modificar y darle contenido a nuestros componentes.

- nombre_componete.component.css
- nombre_componete.component.html
- nombre_componete.component.ts

```tsx
// ---> component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nombre-del-proyecto';
}

```

Vamos a crear dos variables: una con titulo y otra con una lista de tareas, quedando el código de la siguiente forma: 

```tsx
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title : String = "MI PRIMERA PRUEBA";
  welcomew: String  = "Bienvenido a nuestra primera pagina de angular"
  tasks : String[] =[
    'Apreder angular',
    'Probar angular',
    'Probar cli',
    'Lanzar el servidor de angular'
  ]
}

```

Este código define un componente Angular que sirve como el componente raíz de una aplicación Angular. Incorpora varias características importantes y sigue el patrón de componentes independientes introducido en versiones más recientes de Angular. Vamos a desglosarlo para entender mejor cada parte:

### **Importaciones**

- **`import { Component } from '@angular/core';`**: Importa el decorador **`Component`** desde el core de Angular, necesario para definir un nuevo componente.
- **`import { RouterOutlet } from '@angular/router';`**: Importa **`RouterOutlet`**, una directiva que se utiliza para cargar dinámicamente diferentes componentes en función de la ruta de navegación activa, facilitando la creación de aplicaciones de una sola página (SPA).
- **`import { CommonModule } from '@angular/common';`**: Importa **`CommonModule`**, que es un módulo que provee muchas directivas comunes como **`ngIf`**, **`ngFor`**, etc. Es necesario para el uso de estas directivas en componentes independientes (**`standalone: true`**).

### **Decorador `@Component`**

- **`selector: 'app-root',`**: Define el selector CSS para el componente. Esto permite usar el componente con la etiqueta **`<app-root></app-root>`** en HTML.
- **`imports: [CommonModule, RouterOutlet],`**: En un componente independiente, se deben importar explícitamente todos los módulos y componentes que se utilizarán en el template del componente. **`CommonModule`** se importa para utilizar directivas comunes, y **`RouterOutlet`** es necesario para la funcionalidad de enrutamiento.
- **`templateUrl: './app.component.html',`**: Especifica el archivo de plantilla HTML que define la vista del componente.
- **`styleUrl: './app.component.css'`**: Aquí hay un error tipográfico que debe ser **`styleUrls: ['./app.component.css']`**, que es un array de rutas a archivos CSS que definen los estilos del componente.

### **Clase `AppComponent`**

Define la lógica para el componente raíz de la aplicación:

- **`title`**: Una propiedad de tipo **`String`** con un valor inicial, que puede ser utilizada en la plantilla del componente para mostrar un título.
- **`welcome`**: Similar a **`title`**, otra propiedad de tipo **`String`** utilizada para mostrar un mensaje de bienvenida.
- **`tasks`**: Un array de **`String`** que contiene una lista de tareas. Este array también se puede utilizar en la plantilla para mostrar dinámicamente la lista de tareas mediante directivas como **`ngFor`**.

### **Correcciones y Mejoras**

- Cambiar **`styleUrl`** a **`styleUrls`** y asegurarse de que sea un array: **`styleUrls: ['./app.component.css']`**.

Este componente configura una aplicación Angular para usar enrutamiento con **`RouterOutlet`** y permite el uso de directivas comunes mediante la importación de **`CommonModule`**, siguiendo el enfoque de componentes independientes para simplificar la estructura y organización de la aplicación.

Ahora en el archivo `app.component.html`, donde se encuentra el template del componente, vamos a modificarlo para utilizar esta información declarado en el archivo `.ts`

```html
<!-- app.component.html-->

<h1>{{title}}</h1>
<h3>{{welcome}}</h3>
<ul>
  <li *ngFor="let task of tasks">{{task}}</li>
</ul>

```

Este archivo HTML corresponde a la plantilla (**`templateUrl`**) del componente **`AppComponent`** en Angular, basado en el código previo que has proporcionado. Define la estructura de la vista para ese componente. Veamos qué hace cada parte del archivo:

- **`<h1>{{title}}</h1>`**: Muestra el contenido de la propiedad **`title`** del componente dentro de un encabezado de nivel 1 (**`h1`**). La sintaxis **`{{title}}`** es un ejemplo de interpolación en Angular, que permite insertar valores dinámicos en el HTML. En este caso, mostraría "MI PRIMERA PRUEBA" basado en el valor de la propiedad **`title`** del componente.
- **`<h3>{{welcome}}</h3>`**: De manera similar al **`title`**, esta línea muestra el contenido de la propiedad **`welcome`** del componente dentro de un encabezado de nivel 3 (**`h3`**). Utilizando la interpolación, mostraría "Bienvenido a nuestra primera pagina de angular" según el valor asignado a **`welcome`** en el componente.
- **`<ul><li *ngFor="let task of tasks">{{task}}</li></ul>`**: Esta parte utiliza la directiva estructural **`ngFor`** de Angular para iterar sobre el array **`tasks`** definido en el componente. Por cada elemento en el array **`tasks`**, crea un elemento de lista (**`<li>`**) y muestra el valor del elemento actual (**`task`**) dentro de él. Esto resulta en una lista de tareas que se muestra en la página, con cada tarea como un elemento de la lista. Basado en los valores del array **`tasks`** del componente, se generarían cuatro elementos de lista, cada uno mostrando una tarea diferente ("Aprender angular", "Probar angular", "Probar cli", "Lanzar el servidor de angular").

Ahora nuestra app se renderizará de la siguiente forma: 

![Captura de pantalla 2024-03-06 a las 18.24.38.png](Probando%20nuestro%20primer%20proyecto%2024b2f387d5c380c1b09bd85ba43b3716/Captura_de_pantalla_2024-03-06_a_las_18.24.38.png)