# ¿Cómo se crea un component?

### 1. Con el CLI (opción recomendada)

```bash

ng generate component nombre-del-componente
# o
ng g c nombre-del-componente

```

Esto crea:

- `nombre-del-componente.ts` (clase con decorador `@Component`)
- `nombre-del-componente.html` (template)
- `nombre-del-componente.css` (o el estilo especificado) [Stack Overflow+1Reddit+1](https://stackoverflow.com/questions/79673593/angular-component-doesnt-generate-as-component-solved?utm_source=chatgpt.com)

**Nota sobre Angular 20**: Por defecto ya *no* añade sufijos como `.component.ts` al nombre de archivo. Si lo prefieres, configúralo en `angular.json` añadiendo `"type": "component"` bajo los esquemas apropiados .

### 2. Manualmente (si no usas el CLI)

Se requiere crear el archivo `.ts` con el siguiente patrón básico:

```tsx
import { Component } from '@angular/core';

@Component({
  selector: 'app-mi-componente',
  templateUrl: './mi-componente.html',
  styleUrls: ['./mi-componente.css'],
})
export class MiComponente {
  // lógica aquí
}

```

Luego, registra esta clase en el módulo o úsala como **componente standalone**, sin necesidad de NgModule.