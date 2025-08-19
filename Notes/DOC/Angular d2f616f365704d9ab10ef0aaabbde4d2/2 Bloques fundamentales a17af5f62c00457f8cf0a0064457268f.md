# 2. Bloques fundamentales

### 🔹 1. **Componentes (Components)**

Son **las piezas básicas de la UI**. Todo lo que ves en pantalla en una app Angular es un componente.

- Cada componente tiene:
    - Un **HTML** (vista)
    - Un **TS (TypeScript)** (lógica)
    - Un **CSS** (estilo)

📦 Ejemplo:

```tsx

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
})
export class CabeceraComponent {}

```

🧠 Piensa en ellos como bloques de Lego visuales. Cada uno hace algo y se puede reutilizar.

---

### 🔸 2. **Rutas (Routes)**

Permiten **navegar entre componentes/páginas** sin recargar la página completa.

- Se definen en un `RouterModule`
- Angular usa el `path` del navegador para decidir qué componente cargar.

📦 Ejemplo:

```tsx

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'perfil', component: PerfilComponent },
];

```

🧭 Como un GPS interno que dice: “si estás en `/perfil`, muestro el componente del perfil”.

---

### 🔹 3. **Directivas (Directives)**

Son **instrucciones en el HTML** que modifican el comportamiento o apariencia de los elementos.

- **Estructurales**: cambian el DOM (`ngIf`, `ngFor`)
- **Atributo**: modifican estilos o comportamientos (`[ngClass]`, `[ngStyle]`)

📦 Ejemplo:

```html

<div *ngIf="usuarioLogueado">Bienvenido</div>

```

🛠️ Piensa en ellas como "comandos ninja" que Angular ejecuta sobre el DOM.

---

### 🔸 4. **Servicios (Services)**

Contienen **lógica que no es de la interfaz**, como llamadas a APIs, acceso a datos, lógica de negocio, etc.

- Se usan con **inyección de dependencias**.
- Son **singleton por defecto** (una única instancia).

📦 Ejemplo:

```tsx

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  getUsuarios() {
    return this.http.get('/api/usuarios');
  }
}

```

🧪 Metáfora: los servicios son como “el laboratorio detrás de los bastidores”.

---

### 🔹 5. **Módulos (Modules)**

Agrupan y organizan **componentes, directivas, pipes y servicios**.

- Todo proyecto tiene un módulo raíz (`AppModule`)
- Puedes tener módulos funcionales (ej: `AdminModule`, `AuthModule`)

📦 Ejemplo:

```tsx

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

```

📁 Es como el archivador general: todo debe estar registrado ahí para que funcione.

---

### 🔸 6. **Pipes (Tuberías)**

Transforman datos **en el HTML de forma visual** sin tocarlos en el TS.

📦 Ejemplo:

```html

<p>{{ fecha | date:'short' }}</p>
<p>{{ nombre | uppercase }}</p>

```

🎩 Sirven para presentar mejor los datos: mayúsculas, fechas, monedas, etc.

---

### ¿Cómo se relacionan todos estos bloques?

```

Módulo
├── Componentes (Vista + lógica)
│   └── usan Directivas + Pipes
├── Rutas (navegan entre componentes)
├── Servicios (lógica compartida)
└── Pipes (formatean datos)

```