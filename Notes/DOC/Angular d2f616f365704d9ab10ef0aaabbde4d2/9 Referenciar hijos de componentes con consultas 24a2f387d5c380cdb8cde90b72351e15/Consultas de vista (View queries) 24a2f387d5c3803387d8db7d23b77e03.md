# Consultas de vista (View queries)

Las consultas de vista obtienen resultados de los elementos de la **vista del componente**, es decir, los elementos definidos en su **propia plantilla**.

Para consultar un solo resultado se usa `viewChild`:

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
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}

```

En este ejemplo, `CustomCard` consulta un hijo `CustomCardHeader` y usa el resultado en un `computed`.

- Si no se encuentra el elemento, el valor será `undefined` (por ejemplo, si está oculto con `@if`).
- Angular mantiene el valor de `viewChild` siempre actualizado según el estado de la aplicación.

Para consultar **múltiples resultados** se usa `viewChildren`:

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
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map(action => action.text));
}

```

`viewChildren` crea un *signal* con un **Array** de resultados.

> Importante: Las consultas nunca atraviesan los límites de un componente.
> 
> 
> Las *view queries* solo pueden obtener resultados de la plantilla del propio componente.
>