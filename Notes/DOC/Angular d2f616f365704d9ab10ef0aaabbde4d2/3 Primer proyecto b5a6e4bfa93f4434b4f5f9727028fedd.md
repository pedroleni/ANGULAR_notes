# 3. Primer proyecto

Para crear un nuevo proyecto en Angular sin configuración de pruebas, usa el comando **`ng new`** con la opción **`--skip-tests`** o simplemente **`-S`**. Esto te permite saltarte la creación de archivos de prueba (*.spec.ts) para los componentes y otros elementos del proyecto. Abre tu terminal y ejecuta:

```

ng new nombre-del-proyecto --skip-tests

```

Reemplaza **`nombre-del-proyecto`** con el nombre que desees para tu proyecto. Este comando crea una nueva carpeta con el nombre de tu proyecto, instala las dependencias necesarias y configura un nuevo proyecto de Angular sin incluir archivos de pruebas.

---

IMPORTANTE

Desde Angular v17, por defecto los proyectos trabajan sin módulos (module-less)

Pero para trabajar de forma tradicional: **ng new <nombre de la aplicación> --standalone false**

A partir de Angular 17, el concepto de "standalone" ha evolucionado y se ha convertido en la forma principal de construir aplicaciones Angular. Angular ha avanzado hacia un enfoque donde los módulos (`NgModules`) ya no son necesarios para la mayoría de las tareas de desarrollo, marcando una transición significativa hacia un modelo más simple y directo.

### Principales Cambios y Mejoras en Angular 17 relacionados con Standalone:

1. **Estandarización del Enfoque Standalone**:
    - A partir de Angular 17, **el enfoque standalone se convierte en la forma recomendada** para construir componentes, directivas y pipes. Esto significa que los desarrolladores pueden construir aplicaciones completas sin tener que preocuparse por crear módulos (`NgModules`).
    - La propiedad `standalone: true` se sigue utilizando en los decoradores, pero ahora está totalmente integrada como la forma principal de definir componentes.
2. **Simplificación de la Configuración**:
    - Con Angular 17, las configuraciones y el enrutamiento se han simplificado aún más para integrarse mejor con componentes standalone. Ahora, se puede configurar el enrutamiento directamente dentro de componentes standalone, eliminando la necesidad de definir rutas en un `AppModule` o en un módulo separado de enrutamiento.
3. **Soporte Total para Aplicaciones sin Módulos**:
    - Angular 17 ofrece un soporte completo para aplicaciones sin módulos (`NgModules`), lo que permite que las aplicaciones sean más ligeras y más rápidas en términos de tiempo de compilación y carga. Esto es especialmente beneficioso para aplicaciones grandes o para aquellos que buscan optimizar el rendimiento de sus aplicaciones Angular.
4. **Compatibilidad Mejorada**:
    - Aunque Angular 17 promueve el uso de componentes standalone, también asegura la compatibilidad hacia atrás. Las aplicaciones que usan módulos tradicionales (`NgModules`) pueden coexistir con componentes standalone, lo que permite una transición gradual si es necesario.
5. **Herramientas y Soporte de Ecosistema**:
    - Las herramientas de Angular, como Angular CLI, han sido actualizadas para dar un mejor soporte a la creación y manejo de componentes standalone. Los comandos y generadores se han simplificado para que los desarrolladores puedan crear componentes standalone de manera más directa y eficiente.
6. **Mejoras en la Documentación y Buenas Prácticas**:
    - Angular 17 ha incluido actualizaciones importantes en su documentación, enfocándose en guiar a los desarrolladores a través del uso de componentes standalone, proporcionando ejemplos claros y las mejores prácticas para su adopción.

### Ejemplo de un Componente Standalone en Angular 17:

Aquí te muestro cómo se vería un componente standalone típico en Angular 17:

```tsx

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-componente',
  templateUrl: './mi-componente.component.html',
  styleUrls: ['./mi-componente.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class MiComponente {}

```

Este componente `MiComponente` se puede usar directamente en la aplicación sin necesidad de declararlo en un módulo. Puedes importarlo directamente en otros componentes standalone o usarlo en rutas.

### En Resumen:

Angular 17 refuerza y expande el concepto de componentes standalone, llevándolo al centro de la arquitectura de Angular. Esto permite a los desarrolladores construir aplicaciones más simples, modulares y eficientes, eliminando la necesidad de módulos en la mayoría de los casos y haciendo que la estructura de la aplicación sea más directa y fácil de entender.

---

Ahora nos va a preguntar lo siguiente ( puede varias dependiendo de la versión):

```jsx
Would you like to enable autocompletion? This will set up your terminal so pressing 
TAB while typing Angular CLI commands will show possible options and autocomplete 
arguments. (Enabling autocompletion will modify configuration files in your home 
directory.) (Y/n) 
```

El mensaje que mencionas aparece durante la instalación o configuración inicial de Angular CLI en tu terminal. Se refiere a una característica opcional que puedes habilitar para mejorar tu experiencia al usar Angular CLI. La autocompletación es una funcionalidad que te permite escribir comandos más rápidamente y con menos errores al proporcionarte sugerencias automáticas y completar los argumentos de los comandos mientras escribes.

Esto significa que Angular CLI te ofrece la opción de configurar tu terminal para que, al presionar la tecla TAB mientras escribes comandos de Angular CLI, se muestren opciones posibles y se autocompleten los argumentos. Habilitar esta característica modificará algunos archivos de configuración en tu directorio home (tu carpeta de usuario). Esto es algo común para herramientas de línea de comandos que ofrecen autocompletación, ya que necesitan configurar tu shell (bash, zsh, etc.) para que reconozca los comandos y opciones específicas de Angular CLI.

Aceptar esta opción puede hacerte más productivo al usar Angular CLI, ya que reduce la cantidad de texto que necesitas escribir y puede ayudarte a descubrir comandos y opciones que no conocías. Sin embargo, si prefieres no modificar los archivos de configuración de tu shell o si utilizas un entorno donde no deseas realizar estos cambios, puedes elegir no habilitar esta función.

Después nos pregunta lo siguiente: 

```jsx
Would you like to share pseudonymous usage data about this project with the Angular 
Team
at Google under Google's Privacy Policy at https://policies.google.com/privacy. For 
more
details and how to change this setting, see https://angular.io/analytics. 
```

Este mensaje es una solicitud del equipo de Angular, que forma parte de Google, para recopilar datos de uso de manera pseudónima sobre tu proyecto. La recopilación de estos datos tiene como objetivo ayudar a mejorar Angular, ya que permite al equipo de desarrollo entender cómo se utiliza el framework y cuáles características son las más populares o necesitan atención.

Al aceptar, estás permitiendo que se envíen estadísticas de uso, como comandos utilizados, rendimiento de ciertas herramientas, etc., al equipo de Angular. Esto puede incluir, por ejemplo, qué comandos de CLI son los más utilizados o cuánto tiempo toma ejecutar ciertas operaciones. Esta información es valiosa para que los desarrolladores de Angular puedan hacer mejoras específicas basadas en cómo la comunidad utiliza el framework.

Si decides no compartir esta información, simplemente puedes optar por no hacerlo cuando se te solicite. Angular CLI incluye una opción para cambiar esta configuración más tarde si cambias de opinión. Para obtener más detalles sobre qué datos se recopilan y cómo se utilizan, así como instrucciones para cambiar tu preferencia de análisis en cualquier momento, puedes visitar el enlace proporcionado ([https://angular.io/analytics](https://angular.io/analytics)).

La decisión de compartir o no estos datos depende de tus preferencias personales y consideraciones sobre la privacidad. No afectará la funcionalidad de Angular CLI ni de tu proyecto.

Ahora nos pregunta por el tema de CSS y si queremos un preprocesador:

```jsx
Which stylesheet format would you like to use? (Use arrow keys)
❯ CSS 
  SCSS   [ https://sass-lang.com/documentation/syntax#scss                ] 
  Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ] 
  Less   [ http://lesscss.org  
```

Cada opción representa un preprocesador de CSS o el propio CSS, ofreciéndote una forma de escribir estilos con características adicionales que no están disponibles en CSS puro. Aquí tienes un breve resumen de cada opción:

### **CSS**

El formato estándar de hojas de estilo en cascada. Si eliges esta opción, escribirás tus estilos utilizando CSS puro, sin ninguna sintaxis adicional o funcionalidades de preprocesamiento.

### **SCSS (Sassy CSS)**

SCSS es la sintaxis más moderna para Sass, un preprocesador de CSS. Permite el uso de variables, reglas anidadas, mixins, importaciones, herencia y más, lo que puede hacer que tus hojas de estilo sean más fáciles de mantener y reutilizar. SCSS es completamente compatible con la sintaxis de CSS, lo que significa que cualquier archivo CSS válido puede ser considerado un archivo SCSS válido.

### **Sass**

Sass (Syntactically Awesome Stylesheets) es la sintaxis original para Sass y utiliza una sintaxis de indentación en lugar de llaves y punto y coma. Algunos desarrolladores prefieren esta sintaxis por su limpieza y brevedad. Al igual que SCSS, Sass ofrece características como variables, mixins y herencia.

### **Less**

Less es otro preprocesador de CSS que introduce características como variables, mixins, funciones y más. Al igual que Sass, tiene como objetivo hacer que el CSS sea más mantenible y extensible.

### **¿Cuál elegir?**

- **CSS:** Si prefieres la simplicidad o estás trabajando en un proyecto más pequeño que no se beneficiaría mucho del preprocesamiento.
- **SCSS:** Si deseas las características avanzadas de Sass pero prefieres una sintaxis similar a CSS.
- **Sass:** Si prefieres la sintaxis original de Sass que no usa llaves ni punto y coma.
- **Less:** Si te sientes más cómodo con Less o estás trabajando en un proyecto que ya utiliza Less.

La elección depende de tus preferencias personales y posiblemente de los estándares de tu equipo o proyecto. Cada uno tiene sus propias ventajas y puede mejorar significativamente el flujo de trabajo de desarrollo de CSS.

Ahora pregunta por el SSR: 

```jsx
Do you want to enable Server-Side Rendering (SSR) and Static Site Generation 
(SSG/Prerendering)? (y/N) 
```

### **¿Qué es Server-Side Rendering (SSR)?**

SSR es una técnica utilizada para mejorar el rendimiento y la optimización para motores de búsqueda de aplicaciones web modernas. En lugar de que todo el contenido y los componentes de la página se rendericen en el navegador del cliente (renderizado del lado del cliente), SSR permite que las páginas se rendericen en el servidor, enviando al cliente una página completa lista para ser visualizada. Esto es especialmente útil para mejorar los tiempos de carga iniciales y la SEO, ya que el contenido ya está presente en el HTML que recibe el navegador.

### **¿Qué es Static Site Generation (SSG) o Prerendering?**

La generación de sitios estáticos o prerenderización es un caso especial de SSR donde las páginas se renderizan en tiempo de compilación. Esto significa que se crean archivos HTML estáticos para cada página de tu sitio durante el proceso de build. Estos archivos estáticos luego se pueden servir directamente a los usuarios, lo que resulta en tiempos de carga muy rápidos y una mejor SEO, ya que el contenido ya está disponible en el HTML servido.

### **¿Deberías habilitarlo?**

- **Sí (y)**: Si estás desarrollando una aplicación con requisitos significativos de SEO o necesitas mejorar los tiempos de carga iniciales, habilitar SSR y SSG puede ser muy beneficioso. Es especialmente relevante para aplicaciones públicas accesibles donde el rendimiento y la visibilidad en motores de búsqueda son críticos.
- **No (N)**: Si estás trabajando en una aplicación web interna, una SPA (Single Page Application) donde el SEO no es una preocupación, o si simplemente quieres empezar con la configuración más básica y considerar estas optimizaciones más adelante, puedes optar por no habilitar esta característica.

Habilitar SSR y SSG añade complejidad al proyecto, ya que requiere configuración adicional y consideraciones en el desarrollo, como el manejo de datos dinámicos y el rendimiento del servidor. Sin embargo, Angular Universal ofrece herramientas y documentación para simplificar este proceso. La elección depende de tus necesidades específicas de proyecto y tus objetivos de rendimiento y SEO.

---

Después de todo esto nos crea esta arquitectura de archivos 

![Captura de pantalla 2024-03-06 a las 17.38.42.png](3%20Primer%20proyecto%20b5a6e4bfa93f4434b4f5f9727028fedd/Captura_de_pantalla_2024-03-06_a_las_17.38.42.png)

Ahora deberemos instalar las dependencias del proyecto, ya que como vemos no temos el node_modules

```jsx
npm i
```

En mac puede pasar que tengáis que darle permisos especiales para instalar con el sudo, esto os puede pasar también cuando instaléis angular de forma global. 

```jsx
sudo npm i  
```

Con el `sudo` os va a pedir la contraseña de vuestro ordenador. 

---

Una vez instaladas las dependencias tenemos el `serve` del cli para poder ver a tiempo real los cambios producidos en le proyecto. 

```jsx
ng serve
```

Y nos dará una url local donde se esta escuchando el servidor.

```jsx
dev@devs-MacBook-Pro nombre-del-proyecto % ng serve
⠴ Building...
Initial chunk files | Names         |  Raw size
polyfills.js        | polyfills     |  83.60 kB | 
main.js             | main          |  22.05 kB | 
styles.css          | styles        |  95 bytes | 

                    | Initial total | 105.74 kB
Application bundle generation complete. [1.304 seconds]
Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help

```

Si la introducimos la URL al navegador veremos la app inicial de angular

![Captura de pantalla 2024-03-06 a las 17.25.03.png](3%20Primer%20proyecto%20b5a6e4bfa93f4434b4f5f9727028fedd/Captura_de_pantalla_2024-03-06_a_las_17.25.03.png)