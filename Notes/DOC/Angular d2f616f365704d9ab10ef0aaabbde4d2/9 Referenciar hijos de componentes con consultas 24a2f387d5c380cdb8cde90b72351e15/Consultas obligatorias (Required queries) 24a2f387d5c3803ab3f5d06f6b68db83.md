# Consultas obligatorias (Required queries)

Las consultas con `viewChild` o `contentChild` devuelven `undefined` si no encuentran resultado.

Esto puede pasar si el elemento objetivo está oculto o no existe.

Si quieres **asegurarte** de que el hijo está presente y que sea obligatorio, puedes usar `required`:

```tsx

@Component({/* ... */})
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}

```

Si la consulta no encuentra el elemento:

- Angular lanza un error.
- El tipo del *signal* **no incluirá `undefined`**.