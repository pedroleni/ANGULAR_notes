# Añadiendo listeners de eventos

Angular permite definir *event listeners* (escuchadores de eventos) en un elemento dentro de tu plantilla especificando el nombre del evento entre paréntesis, junto con una instrucción que se ejecuta cada vez que ese evento ocurre.

---

### 📌 Escuchando eventos nativos

Cuando quieres añadir escuchadores a un elemento HTML, envuelves el nombre del evento entre paréntesis `()` para indicar a Angular qué función ejecutar.

```tsx

@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class AppComponent {
  updateField(): void {
    console.log('¡El campo ha sido actualizado!');
  }
}

```

✅ En este ejemplo, Angular llama a `updateField` cada vez que el elemento `<input>` emite un evento `keyup`.

Puedes añadir listeners para cualquier evento nativo como: `click`, `keydown`, `mouseover`, etc.

Más información: Lista de eventos en elementos (MDN).

---

### 📌 Accediendo al argumento del evento

En cada listener de evento de plantilla, Angular proporciona una variable llamada `$event` que contiene una referencia al objeto del evento.

```tsx

@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    console.log(`La tecla presionada fue: ${event.key}`);
  }
}

```

---

### 📌 Usando modificadores de teclas

Si quieres capturar eventos de teclado para una tecla específica, normalmente podrías hacer algo así:

```tsx

@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('El usuario presionó Enter en el campo de texto.');
    }
  }
}

```

Como este patrón es muy común, Angular permite **filtrar** directamente el evento añadiendo la tecla tras un punto:

```tsx

@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    console.log('El usuario presionó Enter en el campo de texto.');
  }
}

```

También puedes añadir modificadores extra:

```html

<!-- Coincide con Shift + Enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />

```

Angular soporta los modificadores:

- `alt`
- `control`
- `meta`
- `shift`

---

### 📌 Usando **key** y **code** en eventos de teclado

Puedes especificar la **key** o el **code** que quieres enlazar.

Estas propiedades (`key` y `code`) son parte nativa del objeto `KeyboardEvent` del navegador.

Por defecto, Angular asume que quieres usar `key`.

Si quieres usar `code`, añade el sufijo `.code`.

```html

<!-- Coincide con Alt + Shift izquierdo -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />

```

💡 Esto es útil para manejar eventos de teclado de forma consistente en distintos sistemas operativos.

Por ejemplo:

- En **macOS**, al usar `Alt` + `S`, la propiedad `key` podría devolver `'ß'` (carácter modificado por Alt).
- En cambio, `code` devolverá la tecla física (`ShiftLeft`, `KeyS`), sin importar el carácter producido.

---

### 📌 Evitando el comportamiento por defecto del navegador

Si tu manejador de eventos debe reemplazar la acción nativa, puedes usar `preventDefault()`:

```tsx

@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class AppComponent {
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('Mostrar overlay sin actualizar la URL.');
  }
}

```

ℹ️ Si la expresión del *listener* evalúa a `false`, Angular llama automáticamente a `preventDefault()`, igual que lo hacen los atributos nativos de eventos.

✅ **Recomendación:** llama siempre explícitamente a `preventDefault()` para que tu intención quede clara en el código.

---

## 📋 **Tabla de modificadores de eventos en Angular v20**

| **Categoría** | **Sintaxis** | **Qué hace** | **Ejemplo** |
| --- | --- | --- | --- |
| **Tecla específica** | `(keyup.enter)` | Escucha solo cuando se presiona la tecla **Enter**. | `<input (keyup.enter)="enviar()" />` |
| **Múltiples teclas** | `(keyup.shift.enter)` | Escucha solo cuando se presionan **Shift** + **Enter**. | `<input (keyup.shift.enter)="nuevaLinea()" />` |
| **Tecla modificadora** | `(keydown.alt)` | Escucha solo si se presiona la tecla **Alt** (junto a cualquier otra o sola). | `<input (keydown.alt)="activarAtajo()" />` |
|  | `(keydown.control)` | Escucha solo si se presiona **Ctrl**. | `<input (keydown.control)="guardar()" />` |
|  | `(keydown.meta)` | Escucha solo si se presiona **Meta** (⌘ en Mac, Windows key en PC). | `<input (keydown.meta)="abrirMenu()" />` |
|  | `(keydown.shift)` | Escucha solo si se presiona **Shift**. | `<input (keydown.shift)="seleccionar()" />` |
| **Código físico de tecla** | `(keydown.code.keya)` | Escucha la **tecla física** "A", sin importar el carácter resultante. | `<input (keydown.code.keya)="marcarOpcion()" />` |
|  | `(keydown.code.shiftleft)` | Escucha específicamente **Shift izquierdo**. | `<input (keydown.code.shiftleft)="activarModoEspecial()" />` |
| **Combinaciones avanzadas** | `(keydown.code.alt.keyz)` | Escucha **Alt** + tecla **Z** física. | `<input (keydown.code.alt.keyz)="deshacerAccion()" />` |
| **Prevención por defecto** | `(click)="accion($event)"` + `preventDefault()` | Cancela la acción nativa del navegador (ej. seguir un enlace). | `<a href="#" (click)="abrirModal($event)">Abrir</a>` |
| **Con retorno falso** | `(submit)="validarFormulario() === false"` | Si devuelve `false`, Angular llama a `preventDefault()` automáticamente. | `<form (submit)="validarFormulario()">...</form>` |

---

## 📌 **Notas importantes**

1. **`key` vs `code`**
    - `key` → lo que devuelve depende del carácter final (puede cambiar con idioma o modificadores).
    - `code` → siempre corresponde a la tecla física (más consistente para atajos).
2. **Orden de modificadores**
    
    Angular no es sensible al orden, pero **se recomienda escribir primero modificadores y luego tecla principal**.
    
    Ejemplo: `(keyup.shift.enter)` ✅ y no `(keyup.enter.shift)`.
    
3. **Evitar conflictos de accesibilidad**
    
    Si usas combinaciones de teclas personalizadas, respeta los atajos estándar del sistema operativo y del navegador.
    

---