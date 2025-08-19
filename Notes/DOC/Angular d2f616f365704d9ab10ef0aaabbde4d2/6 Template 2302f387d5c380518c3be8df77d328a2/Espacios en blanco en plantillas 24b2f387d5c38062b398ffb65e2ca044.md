# Espacios en blanco en plantillas

Por defecto, las plantillas de Angular **no preservan** los espacios en blanco que el framework considera innecesarios.

Esto suele ocurrir en dos casos:

1. Espacios en blanco **entre elementos**.
2. Espacios en blanco **colapsables** dentro de texto.

---

## Espacios en blanco entre elementos

La mayoría de los desarrolladores formatean sus plantillas con saltos de línea e indentación para hacerlas más legibles:

```html

<section>
  <h3>User profile</h3>
  <label>
    User name
    <input>
  </label>
</section>

```

Esta plantilla contiene espacios en blanco entre todos los elementos.

El siguiente ejemplo muestra el mismo HTML pero reemplazando cada espacio con el carácter `#` para visualizar cuántos hay:

```html

<!-- Total Whitespace: 20 -->
<section>###<h3>User profile</h3>###<label>#####User name#####<input>###</label>#</section>

```

Si se conservaran estos espacios exactamente como están escritos, se generarían muchos nodos de texto innecesarios, aumentando la carga de renderizado de la página.

Ignorando estos espacios entre elementos, Angular realiza menos trabajo al renderizar, mejorando el rendimiento.

---

## Espacios en blanco colapsables dentro de texto

Cuando el navegador renderiza HTML, **colapsa** múltiples espacios consecutivos en uno solo:

**En la plantilla:**

```html

<p>Hello         world</p>

```

**En el navegador:**

```html

<p>Hello world</p>

```

Consulta *Cómo maneja el HTML, CSS y el DOM los espacios en blanco* para más contexto sobre este comportamiento.

Angular evita enviar esos espacios innecesarios al navegador, colapsándolos a uno solo durante la compilación de la plantilla.

---

## Conservar espacios en blanco

Puedes indicar a Angular que conserve los espacios en blanco en una plantilla usando la opción `preserveWhitespaces: true` en el decorador `@Component`:

```tsx

@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})

```

> ⚠️ Evita usar esta opción salvo que sea absolutamente necesario, ya que conservar espacios en blanco puede hacer que Angular genere muchos más nodos al renderizar, ralentizando la aplicación.
> 

Además, puedes usar una **entidad HTML especial de Angular**, `&ngsp;`.

Esta entidad produce un único carácter de espacio que **se preserva** en el resultado compilado.