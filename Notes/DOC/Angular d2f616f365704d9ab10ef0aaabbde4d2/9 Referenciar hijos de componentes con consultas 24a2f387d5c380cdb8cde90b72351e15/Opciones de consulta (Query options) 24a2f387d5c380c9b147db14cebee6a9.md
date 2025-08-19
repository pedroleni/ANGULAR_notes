# Opciones de consulta (Query options)

Todas las funciones de consulta aceptan un **objeto de opciones** como segundo parámetro.

Estas opciones controlan cómo la consulta obtiene sus resultados.

---

## **Leer valores específicos del inyector de un elemento**

Por defecto, el **localizador** de la consulta indica tanto el elemento que buscas como el valor que se recupera.

Alternativamente, puedes especificar la opción `read` para obtener un valor diferente del elemento encontrado por el localizador.

```tsx

@Component({/*...*/})
export class CustomExpando {
  toggle = contentChild(ExpandoContent, { read: TemplateRef });
}

```

En el ejemplo anterior, se localiza un elemento con la directiva `ExpandoContent` y se obtiene el `TemplateRef` asociado a ese elemento.

El uso más común de `read` es para recuperar:

- `ElementRef`
- `TemplateRef`

---

## **Descendientes en consultas de contenido**

- Por defecto, `contentChildren` **solo encuentra hijos directos** del componente y **no** recorre descendientes.
- `contentChild` **sí recorre descendientes** por defecto.

```tsx

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChildren(CustomToggle); // no encuentra nada
  // toggle = contentChild(CustomToggle); // sí encuentra
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <custom-toggle>Mostrar</custom-toggle>
      </some-other-component>
    </custom-expando>
  `
})
export class UserProfile { }

```

En el ejemplo anterior, `CustomExpando` no puede encontrar `<custom-toggle>` con `contentChildren` porque no es un hijo directo de `<custom-expando>`.

Si configuras `{ descendants: true }`, la consulta recorrerá todos los descendientes **dentro de la misma plantilla**.

> Importante: Las consultas nunca atraviesan los límites de un componente para recorrer elementos de otras plantillas.
> 

> Nota: Las consultas de vista (view queries) no tienen esta opción porque siempre recorren descendientes.
>