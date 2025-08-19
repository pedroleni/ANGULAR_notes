# Proyecto servicios con signals

## ⚙️ PASOS PARA GENERARLO TÚ MISMO

### 1. ✅ Crea el proyecto

```bash

ng new contador-app --standalone --strict --routing=false --style=css
cd contador-app

```

---

### 2. ✅ Añade el archivo del servicio

📁 Crea: `src/app/services/contador.service.ts`

```tsx
import { Injectable, signal } from '@angular/core';

@Injectable()
export class ContadorService {
  private _valor = signal(0);
  readonly valor = this._valor.asReadonly();

  incrementar() {
    this._valor.update((v) => v + 1);
  }

  reiniciar() {
    this._valor.set(0);
  }
}

```

---

### 3. ✅ Crea el componente standalone

📁 Crea: `src/app/components/contador.component.ts`

```tsx
import { Component, inject } from '@angular/core';
import { ContadorService } from '../services/contador.service';
import { ContadorComponent } from '../components/contador.component';

@Component({
  selector: 'contador-page',
  standalone: true,
  imports: [ContadorComponent],
  providers: [ContadorService],
  template: ` <app-contador></app-contador> `,
})
export class ContadorPageComponent {
  // Rename to avoid selector/class name conflict
  contador = inject(ContadorService);
}

```

---

### 4. ✅ Configura el `main.ts`

📁 Edita: `src/main.ts`

```tsx

import { bootstrapApplication } from '@angular/platform-browser';
import { ContadorComponent } from './app/componentscontador.component';

bootstrapApplication(ContadorComponent)
  .catch(err => console.error(err));

```

---

### 5. ✅ (Opcional) Ajusta `tsconfig.app.json` para habilitar `signals`

📁 Edita: `tsconfig.app.json` y añade:

```json

"angularCompilerOptions": {
  "enableSignals": true}

```

> (Puede que ya esté activado por defecto si usaste --standalone con Angular 17+)
> 

---

### 6. ✅ Lanza la app

```bash

ng serve

```

Abre en tu navegador: [http://localhost:4200](http://localhost:4200/)

---

## 🎉 Resultado

Tendrás una app standalone, sin NgModules, con un servicio injectado que gestiona el estado de un contador de forma reactiva.

[contador-app-servicios.zip](Proyecto%20servicios%20con%20signals%202302f387d5c380bcb4a9c1313553f381/contador-app-servicios.zip)