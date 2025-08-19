# Renderizar plantillas desde un componente padre con ng-content

`<ng-content>` es un elemento especial que acepta *markup* (código HTML) o un fragmento de plantilla, y controla cómo los componentes renderizan contenido.

Este elemento **no** genera un elemento real en el DOM.

---

### Ejemplo

Aquí tienes un ejemplo de un componente **BaseButton** que acepta cualquier *markup* proveniente de su componente padre.

```tsx

// ./base-button/base-button.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'button[baseButton]',
  template: `
      <ng-content />
  `,
})
export class BaseButton {}

```

```tsx

// ./app.component.ts
import { Component } from '@angular/core';
import { BaseButton } from './base-button/base-button.component.ts';

@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `
    <button baseButton>
      Next <span class="icon arrow-right" />
    </button>
  `,
})
export class AppComponent {}

```

---