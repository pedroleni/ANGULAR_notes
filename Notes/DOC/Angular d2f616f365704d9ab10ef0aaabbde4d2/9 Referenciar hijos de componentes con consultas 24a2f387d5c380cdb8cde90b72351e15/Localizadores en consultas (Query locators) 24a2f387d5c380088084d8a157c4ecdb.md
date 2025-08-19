# Localizadores en consultas (Query locators)

El primer argumento de cada función de consulta es su **localizador**.

Normalmente usarás un componente o directiva como locator.

También puedes usar una **variable de referencia de plantilla** como string:

```tsx

@Component({
  /*...*/
  template: `
    <button #guardar>Guardar</button>
    <button #cancelar>Cancelar</button>
  `
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('guardar');
}

```

Si varias referencias tienen el mismo nombre, la consulta devuelve la **primera** que coincida.

> Angular no admite selectores CSS como query locators.
> 

---

## **Consultas y el árbol de inyección (Injector tree)**

En casos avanzados, puedes usar cualquier **ProviderToken** como localizador.

Esto permite encontrar elementos según los *providers* de componentes o directivas.

Ejemplo con `InjectionToken`:

```tsx

const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{ provide: SUB_ITEM, useValue: 'item-especial' }],
})
export class SpecialItem { }

@Component({/*...*/})
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}

```

Aquí se usa un `InjectionToken` como localizador, pero puedes usar cualquier `ProviderToken` para localizar elementos específicos.