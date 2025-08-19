# 4. Archivos del proyecto

![Captura de pantalla 2024-08-28 a las 1.07.34.png](4%20Archivos%20del%20proyecto%20de242d7c6b27439eb810565a3c8a2c03/Captura_de_pantalla_2024-08-28_a_las_1.07.34.png)

A continuación, te explico los archivos y carpetas que aparecen en la imagen:

### Carpetas:

1. **`.angular`**:
    - Esta carpeta contiene archivos generados por Angular CLI, como datos temporales y archivos de configuración para el proyecto. No es necesario modificarla directamente.
2. **`.vscode`**:
    - Contiene configuraciones específicas para el editor Visual Studio Code, como ajustes de linting, snippets, o configuraciones de depuración.
3. **`node_modules`**:
    - Aquí se encuentran todas las dependencias de Node.js que el proyecto necesita para funcionar, instaladas a través de npm. Esta carpeta es generada automáticamente cuando ejecutas `npm install` y no se debe modificar manualmente.
4. **`src`**:
    - Es la carpeta principal donde resides el código fuente de la aplicación Angular. Dentro de `src`, encontrarás subcarpetas como `app` (que contiene componentes, servicios, y demás archivos de código de la aplicación) y otros archivos como `index.html`, `main.ts`, `styles.css`, etc.

### Archivos:

1. **`.editorconfig`**:
    - Este archivo se usa para mantener estilos de codificación consistentes en diferentes editores y entornos. Define cosas como el tipo de sangría (tabulaciones o espacios), el tamaño de las sangrías, y la codificación de los archivos.
2. **`.gitignore`**:
    - Este archivo contiene una lista de archivos y directorios que Git debe ignorar. Normalmente, se excluyen archivos y carpetas como `node_modules`, `dist`, archivos de configuración locales, etc.
3. **`angular.json`**:
    - Es el archivo de configuración principal para un proyecto Angular. Define cómo se deben construir, servir y testear las aplicaciones y librerías Angular. Incluye configuraciones para las diferentes arquitecturas (`build`, `serve`, `test`, etc.), la estructura de los archivos de salida, y más.
4. **`package-lock.json`**:
    - Este archivo es generado automáticamente por npm. Bloquea las versiones de las dependencias para garantizar que la misma configuración funcione de manera idéntica en cualquier entorno donde se instale el proyecto.
5. **`package.json`**:
    - Este es uno de los archivos más importantes. Define el proyecto y sus dependencias, scripts de npm, y configuraciones básicas. Aquí se listan todas las dependencias y versiones que el proyecto necesita para funcionar.
6. **`README.md`**:
    - Es un archivo de texto en formato Markdown que generalmente contiene información sobre el proyecto: cómo configurarlo, cómo ejecutarlo, qué hace el proyecto, etc. Es útil para otros desarrolladores que trabajen en el proyecto o para documentación general.
7. **`tsconfig.app.json`**:
    - Este archivo es una configuración específica de TypeScript para la aplicación Angular (excluye pruebas, por ejemplo). Define cómo se debe compilar el código TypeScript dentro de la aplicación.
8. **`tsconfig.json`**:
    - Este es el archivo de configuración de TypeScript general para el proyecto. Aquí se configuran las opciones del compilador TypeScript, incluyendo opciones como el nivel de strictness, la versión de ECMAScript a usar, etc.
9. **`tsconfig.spec.json`**:
    - Este archivo contiene la configuración de TypeScript para los archivos de pruebas (`.spec.ts`). Define las opciones del compilador específicas para ejecutar tests en el proyecto.

## SRC

![image.png](4%20Archivos%20del%20proyecto%20de242d7c6b27439eb810565a3c8a2c03/image.png)

### **🔧 Configuración**

- **app.config.ts**
    
    Archivo de configuración compartida para el cliente (browser). Puede contener cosas como rutas de lazy loading, inyección de dependencias, etc.
    
- **app.config.server.ts**
    
    Configuración específica para el entorno del servidor. Es común en aplicaciones que usan SSR (Server-Side Rendering), como Angular Universal.
    

---

### **🎨 Estilos y plantilla**

- **app.css**
    
    Hoja de estilos globales o específicos del componente raíz AppComponent. Puede contener clases utilizadas en app.html.
    
- **app.html**
    
    Plantilla HTML del componente raíz. Define la estructura visual principal de la app.
    

---

### **🌐 Ruteo**

- **app.routes.ts**
    
    Define las rutas de la aplicación en el cliente. Se usa con RouterModule.forRoot().
    
- **app.routes.server.ts**
    
    Define rutas solo para el servidor (SSR), útil para prerendering o redirecciones específicas.
    

---

### **🧪 Pruebas**

- **app.spec.ts**
    
    Archivo de pruebas unitarias para el componente principal AppComponent.
    

---

### **🧠 Componente principal**

- **app.ts**
    
    El componente raíz de Angular (antes sería app.component.ts, aquí parece renombrado a app.ts, posiblemente con standalone components).
    

---

### **💡 Notas adicionales sobre Angular v20:**

- **Uso de standalone components**: Ya no se usan módulos (AppModule) en muchas configuraciones. Angular v20 fomenta el uso de componentes independientes.

### Resumen

Estos archivos y carpetas constituyen la base de un proyecto Angular típico. Cada uno juega un papel importante en la configuración, construcción y desarrollo de la aplicación. Es importante comprender su función para poder manejar y personalizar un proyecto Angular de manera eficiente.