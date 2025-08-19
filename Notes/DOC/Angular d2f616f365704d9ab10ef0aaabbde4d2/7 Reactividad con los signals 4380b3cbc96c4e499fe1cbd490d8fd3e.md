# 7. Reactividad con los signals

## ⚙️ ¿Qué es un signal?

Un **signal** es una señal reactiva que encapsula un valor y notifica a Angular cuando cambia, dejando que actualice SOLO lo necesario.

Un *signal* es un contenedor para un valor que notifica a los consumidores interesados cuando ese valor cambia. Los signals pueden contener cualquier tipo de valor, desde primitivos hasta estructuras de datos complejas.

Se lee el valor de un *signal* llamando a su función *getter*, lo que permite a Angular rastrear dónde se utiliza ese *signal*.

Los *signals* pueden ser de escritura (*writable*) o solo de lectura (*read-only*).

---

### Signals de escritura (Writable signals)

Los *writable signals* proporcionan una API para actualizar sus valores directamente. Se crean con la función `signal`pasando el valor inicial:

```tsx

const count = signal(0);
console.log('El contador es: ' + count());

```

Para cambiar el valor:

```tsx
count.set(3);

```

O usando `.update()` para calcular un nuevo valor a partir del anterior:

```tsx

count.update(value => value + 1);

```

### 📌 `update()`  vs `set()`

| Método | ¿Qué hace? | ¿Cuándo usarlo? |
| --- | --- | --- |
| `set()` | Reemplaza completamente el valor | Cuando ya tienes el **nuevo valor** |
| `update()` | Modifica el valor actual usando una función | Cuando quieres **cambiar el valor con base en el actual** |

### 🔹 `set()`: establece el valor directamente

```tsx

counter.set(10);      // ahora counter() === 10

```

### 🔹 `update()`: transforma el valor actual

```tsx

counter.update(v => v + 1);  // ahora counter() === 11

```

### 📌 ¿Por qué existe `update()` si ya tengo `set()`?

Porque `update()` te da acceso **seguro y directo** al valor anterior. Útil para operaciones **acumulativas**, **condicionales** o **reactivas**.

Tienen el tipo `WritableSignal`.

---

### Signals computados (Computed signals)

Son signals *read-only* cuyo valor deriva de otros signals. Se definen con la función `computed`:

```tsx

const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);

```

Angular detecta automáticamente que `doubleCount` depende de `count`.

### Evaluación diferida y memoización

- Solo se evalúan cuando se leen por primera vez.
- El valor calculado se guarda en caché.
- Si `count` cambia, se invalida el valor de `doubleCount`.

### No son de escritura

```tsx

doubleCount.set(3); // Error

```

### Dependencias dinámicas

Solo se rastrean los signals leídos durante la ejecución:

```tsx

const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `El contador es ${count()}.`;
  } else {
    return '¡Nada que ver aquí!';
  }
});

```

Si `showCount` es `false`, `count` ni se lee, por lo tanto no es dependencia.

---

### Lectura de signals en componentes `OnPush`

Cuando se lee un signal en la plantilla de un componente `OnPush`, Angular rastrea la dependencia y marcará el componente para detección de cambios cuando ese valor cambie.

---

### Efectos (Effects)

Un *effect* es una operación que se ejecuta cada vez que cambia uno o más valores de *signals*:

```tsx

effect(() => {
  console.log(`El contador actual es: ${count()}`);
});

```

- Se ejecutan al menos una vez.
- Rastrea cualquier signal leído.
- Se ejecutan de forma **asíncrona** durante la detección de cambios.

### Casos de uso comunes

- Registro de datos o analíticas.
- Sincronizar datos con `localStorage`.
- Comportamientos personalizados en el DOM.
- Renderizado con `<canvas>` o bibliotecas externas.

### Cuándo **no** usarlos

Evita usarlos para propagar cambios de estado. Usa mejor signals computados para modelar dependencias.

---

### **Injection context**

Los efectos deben crearse en un contexto de inyección (donde `inject()` está disponible), como en constructores de componentes, directivas o servicios:

```tsx

@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor() {
    effect(() => {
      console.log(`El contador es: ${this.count()}`);
    });
  }
}

```

También puedes asignarlo a una propiedad:

```tsx

private loggingEffect = effect(() => {
  console.log(`El contador es: ${this.count()}`);
});

```

O pasar un `Injector` manualmente:

```tsx

effect(() => {
  console.log(`El contador es: ${this.count()}`);
}, { injector: this.injector });

```

---

### Destrucción de efectos

Los efectos se destruyen automáticamente cuando el contexto que los creó también se destruye.

Si deseas destruirlo manualmente:

```tsx

const ref = effect(...);
ref.destroy();

```

---

### Temas avanzados

### Funciones de igualdad personalizadas

Puedes pasar una función `equal` para evitar emitir actualizaciones si el nuevo valor es "igual":

```tsx

const data = signal(['test'], { equal: _.isEqual });
data.set(['test']); // No actualiza

```

### Lectura sin rastrear dependencias

Para leer un signal sin rastrearlo como dependencia:

```tsx

effect(() => {
  console.log(`Usuario: ${currentUser()} y contador: ${untracked(counter)}`);
});

```

O envolver un bloque completo:

```tsx

untracked(() => {
  this.loggingService.log(`Usuario: ${user}`);
});

```

---

### Funciones de limpieza en efectos

Puedes cancelar operaciones de larga duración al registrar una limpieza:

```tsx

effect((onCleanup) => {
  const user = currentUser();
  const timer = setTimeout(() => {
    console.log(`Hace 1 segundo, el usuario era ${user}`);
  }, 1000);
  onCleanup(() => {
    clearTimeout(timer);
  });
});

```

---

## 🆕 Novedades en Angular 20

Angular 20 promueve APIs clave a **estable**:

- `effect`, `toSignal`, `linkedSignal` ya son de producción .

Además, trae estas herramientas nuevas:

### a) `linkedSignal`

Señal escribible que se enlaza a otras señales:

```tsx

const selected = signal('A');
const linked = linkedSignal({
  source: () => ({ selected: selected() }),
  compute: ({ selected }, prev) => selected === 'A' ? 1 : prev ?? 0
});

```

Permite lógica derivada pero editable.

### b) `resource`, `streamingResource`, `httpResource` (experimental)

Manejan datos asíncronos de forma reactiva:

```tsx

const userId = signal('123');
const user = resource({
  params: () => ({ id: userId() }),
  loader: ({ request, abortSignal }) =>
    fetch(`users/${request.id}`, { signal: abortSignal }).then(r => r.json())
});

```

Cuando cambie `userId()`, re-fetch automáticamente.

### c) Zoneless Change Detection

Modo opcional sin `Zone.js`, menos peso y más rendimiento.

---

## 🧩 Ejemplo completo

```tsx

@Component({
  selector: 'app-counter',
  template: `
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubled() }}</p>
    <button (click)="increment()">+1</button>
  `,
  standalone: true,
})
export class CounterComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  increment() {
    this.count.update(v => v + 1);
  }

  constructor() {
    effect(() => console.log('Count agora:', this.count()));
  }
}

```

- `count` — señal mutable
- `doubled` — derivada
- `effect` — reacciona al cambio
    
    

---

## 📋 Resumen

| Primitiva | Tipo | Uso |
| --- | --- | --- |
| `signal()` | WritableSignal<T> | estado interno modificable |
| `computed()` | Signal<T> | valor derivado, solo lectura |
| `effect()` | — | efectos secundarios reactivamente |
| `linkedSignal()` | WritableSignal enlazado | derivado y modificable |
| `resource()` | Signal<async data> | fetch reactivo al cambiar dependencias |