# Consultas basadas en decoradores

> TIP: Aunque el equipo de Angular recomienda usar las funciones de consulta basadas en signals para nuevos proyectos, las APIs originales basadas en decoradores siguen totalmente soportadas.
> 

También puedes declarar consultas añadiendo el **decorador correspondiente** a una propiedad.

Las consultas con decorador se comportan igual que las basadas en signals, salvo lo que se describe a continuación.

---

### **Consultas de vista**

Para un solo resultado, se usa el decorador `@ViewChild`:

```tsx

@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>¡Visita California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

  ngAfterViewInit() {
    console.log(this.header.text);
  }
}

```

En este ejemplo, el componente `CustomCard` consulta un hijo `CustomCardHeader` y accede al resultado en `ngAfterViewInit`.

- Angular mantiene el resultado de `@ViewChild` actualizado conforme cambia el estado de la aplicación.
- Los resultados de consultas de vista con decorador están disponibles **a partir de `ngAfterViewInit`**.
    
    Antes de este punto, el valor será `undefined`.
    

Consulta la sección de **Ciclo de vida** para más detalles sobre este momento.

---

### **Múltiples resultados con @ViewChildren**

Puedes consultar varios resultados usando el decorador `@ViewChildren`:

```tsx

@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Guardar</custom-card-action>
    <custom-card-action>Cancelar</custom-card-action>
  `,
})
export class CustomCard {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

  ngAfterViewInit() {
    this.actions.forEach(action => {
      console.log(action.text);
    });
  }
}

```

- `@ViewChildren` crea un objeto `QueryList` que contiene los resultados de la consulta.
- Puedes **suscribirte a los cambios** en los resultados a través de la propiedad `changes`.

## **Consultas de contenido (Content queries)**

Puedes obtener un único resultado usando el decorador `@ContentChild`:

```tsx

@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  @ContentChild(CustomToggle) toggle: CustomToggle;

  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Mostrar</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }

```

En este ejemplo, el componente `CustomExpando` consulta un hijo `CustomToggle` y accede al resultado en `ngAfterContentInit`.

- Angular mantiene el resultado de `@ContentChild` **actualizado** conforme cambia el estado de la aplicación.
- Los resultados de consultas de contenido están disponibles **en el método del ciclo de vida `ngAfterContentInit`**.
    
    Antes de este punto, el valor será `undefined`.
    
- Consulta la sección **Ciclo de vida** para más detalles.

---

## **Múltiples resultados con @ContentChildren**

Puedes obtener varios resultados usando el decorador `@ContentChildren`:

```tsx

@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

  ngAfterContentInit() {
    this.items.forEach(item => {
      console.log(item.text);
    });
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Queso</custom-menu-item>
      <custom-menu-item>Tomate</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }

```

- `@ContentChildren` crea un objeto `QueryList` que contiene los resultados de la consulta.
- Puedes **suscribirte** a los cambios de los resultados a lo largo del tiempo mediante la propiedad `changes`.

---

## **Opciones en consultas basadas en decoradores**

Todos los decoradores de consulta aceptan un **objeto de opciones** como segundo parámetro.

Estas opciones funcionan igual que en las consultas basadas en *signals*, salvo lo descrito a continuación.

---

## **Consultas estáticas (Static queries)**

Los decoradores `@ViewChild` y `@ContentChild` aceptan la opción `static`:

```tsx

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>¡Visita California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader, { static: true }) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}

```

- Al establecer `static: true`, garantizas a Angular que el elemento objetivo de la consulta **siempre estará presente** y **no** se renderiza de forma condicional.
- Esto permite que el resultado esté disponible antes, en el método de ciclo de vida `ngOnInit`.
- **Importante:** Los resultados de consultas estáticas **no se actualizan** después de la inicialización.

> La opción static no está disponible para @ViewChildren ni @ContentChildren.
> 

---

## **Uso de QueryList**

- `@ViewChildren` y `@ContentChildren` devuelven un objeto `QueryList` que contiene la lista de resultados.
- `QueryList` ofrece métodos de conveniencia para trabajar con los resultados como si fueran un array:
    
    `map`, `reduce`, `forEach`, etc.
    
- Puedes obtener un **array** de los resultados actuales con `.toArray()`.
- También puedes suscribirte a la propiedad `changes` para reaccionar cuando los resultados cambien.