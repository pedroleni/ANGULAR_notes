# Agrupar elementos con <ng-container>

`<ng-container>` es un elemento especial de Angular que **agrupa varios elementos** o **marca una ubicación en una plantilla** sin generar un elemento real en el DOM.

**Ejemplo en la plantilla del componente:**

```html

<section>
  <ng-container>
    <h3>Biografía del usuario</h3>
    <p>Aquí hay algo de información sobre el usuario</p>
  </ng-container>
</section>

```

**DOM renderizado:**

```html

<section>
  <h3>Biografía del usuario</h3>
  <p>Aquí hay algo de información sobre el usuario</p>
</section>

```

---

Puedes aplicar directivas a `<ng-container>` para añadir comportamientos o configuraciones a una parte de tu plantilla.

> ⚠️ Angular ignora todos los bindings de atributos y listeners de eventos aplicados directamente a <ng-container>, incluyendo los aplicados mediante una directiva.
> 

---

## Contenido de esta página

1. Usar `<ng-container>` para mostrar contenido dinámico.
2. Renderizar componentes.
3. Renderizar fragmentos de plantilla.
4. Usar `<ng-container>` con directivas estructurales.
5. Usar `<ng-container>` para inyección.

---

## 1. Usar `<ng-container>` para mostrar contenido dinámico

`<ng-container>` puede actuar como **marcador de posición** para renderizar contenido dinámico.

---

### Renderizar componentes

Puedes usar la directiva incorporada `NgComponentOutlet` de Angular para renderizar dinámicamente un componente en la ubicación del `<ng-container>`.

```tsx

@Component({
  template: `
    <h2>Tu perfil</h2>
    <ng-container [ngComponentOutlet]="componentePerfil()" />
  `
})
export class UserProfile {
  isAdmin = input(false);
  componentePerfil = computed(() => this.isAdmin() ? AdminProfile : BasicUserProfile);
}

```

En el ejemplo anterior, la directiva `NgComponentOutlet` renderiza dinámicamente **AdminProfile** o **BasicUserProfile** en la ubicación del `<ng-container>`.

---

### Renderizar fragmentos de plantilla

Puedes usar la directiva incorporada `NgTemplateOutlet` de Angular para renderizar dinámicamente un **fragmento de plantilla** en la ubicación del `<ng-container>`.

```tsx

@Component({
  template: `
    <h2>Tu perfil</h2>
    <ng-container [ngTemplateOutlet]="plantillaPerfil()" />
    <ng-template #admin>Este es el perfil de administrador</ng-template>
    <ng-template #basic>Este es el perfil básico</ng-template>
  `
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  plantillaPerfil = computed(() => this.isAdmin() ? this.adminTemplate() : this.basicTemplate());
}

```

En este ejemplo, la directiva `ngTemplateOutlet` renderiza dinámicamente uno de los dos fragmentos de plantilla en la ubicación del `<ng-container>`.

> Para más información sobre NgTemplateOutlet, consulta la página de documentación de su API.
> 

---

## 2. Usar `<ng-container>` con directivas estructurales

También puedes aplicar **directivas estructurales** a elementos `<ng-container>`.

Ejemplos comunes: `*ngIf` y `*ngFor`.

```html

<ng-container *ngIf="permissions == 'admin'">
  <h1>Panel de administrador</h1>
  <admin-infographic></admin-infographic>
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>

```

Esto es útil para aplicar una directiva estructural **sin envolver el contenido en un elemento adicional** en el DOM.

---

## 3. Usar `<ng-container>` para inyección

Consulta la guía de **Inyección de dependencias** para más información sobre el sistema de inyección de Angular.

Cuando aplicas una directiva a `<ng-container>`, los elementos descendientes pueden **inyectar la directiva** o cualquier valor que ésta provea.

Esto sirve cuando quieres **proporcionar declarativamente un valor** a una parte específica de tu plantilla.

```tsx

@Directive({
  selector: '[theme]',
})
export class Theme {
  // Crea un input que acepta 'light' o 'dark', con valor por defecto 'light'.
  mode = input<'light' | 'dark'>('light');
}

```

```html

<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>

```

En el ejemplo anterior, los componentes **ProfilePic** y **UserBio** pueden inyectar la directiva `Theme` y aplicar estilos basados en su `mode`.