# Consultas de contenido (Content queries)

Las consultas de contenido obtienen resultados de los elementos que forman parte del **contenido** del componente, es decir, elementos anidados dentro del componente en la plantilla donde se usa.

Para un solo resultado se usa `contentChild`:

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
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}

@Component({
  /* ... */
  // CustomToggle se usa como contenido de CustomExpando
  template: `
    <custom-expando>
      <custom-toggle>Mostrar</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }

```

En este ejemplo, `CustomExpando` consulta un hijo `CustomToggle` y accede a él en un `computed`.

- Si no encuentra el elemento, el valor será `undefined` (por ejemplo, si está oculto o no está presente).
- Angular mantiene el valor de `contentChild` actualizado según el estado de la aplicación.
- Por defecto, las consultas de contenido **solo buscan hijos directos** y no recorren descendientes.

Para múltiples resultados se usa `contentChildren`:

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
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map(item => item.text));
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

`contentChildren` crea un *signal* con un **Array** de resultados.

> Igual que las consultas de vista, las consultas de contenido no atraviesan los límites de un componente.
>