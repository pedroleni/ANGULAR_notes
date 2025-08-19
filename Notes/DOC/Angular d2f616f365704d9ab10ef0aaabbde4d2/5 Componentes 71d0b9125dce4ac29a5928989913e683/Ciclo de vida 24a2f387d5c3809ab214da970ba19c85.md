# Ciclo de vida

El ciclo de vida de un componente es la secuencia de pasos que ocurren entre su creación y su destrucción.

Cada paso representa una parte distinta del proceso de Angular para renderizar componentes y comprobar si necesitan actualizaciones con el tiempo.

En tus componentes, puedes implementar **métodos de ciclo de vida** (*lifecycle hooks*) para ejecutar código en esos pasos.

- Los *hooks* que se relacionan con una instancia específica de un componente se implementan como **métodos** en su clase.
- Los *hooks* que se relacionan con toda la aplicación Angular se implementan como **funciones** que aceptan un *callback*.

El ciclo de vida de un componente está estrechamente ligado a cómo Angular verifica cambios en los componentes a lo largo del tiempo.

Para entender este ciclo, basta con saber que Angular recorre el árbol de tu aplicación de arriba a abajo, comprobando los *bindings* de las plantillas para detectar cambios.

Los *hooks* descritos a continuación se ejecutan durante este recorrido, que visita **cada componente una sola vez**.

Por eso, **no debes** hacer cambios de estado a mitad del proceso.

---

## **Resumen de fases**

| Fase | Método | Resumen |
| --- | --- | --- |
| **Creación** | `constructor` | Constructor estándar de JavaScript. Se ejecuta cuando Angular instancia el componente. |
| **Detección de cambios** | `ngOnInit` | Se ejecuta una sola vez, tras inicializar todas las entradas (*inputs*) del componente. |
|  | `ngOnChanges` | Se ejecuta cada vez que cambian las entradas del componente. |
|  | `ngDoCheck` | Se ejecuta cada vez que Angular verifica cambios en el componente. |
|  | `ngAfterContentInit` | Se ejecuta una vez tras inicializar el contenido proyectado en el componente. |
|  | `ngAfterContentChecked` | Se ejecuta cada vez que se comprueba el contenido proyectado. |
|  | `ngAfterViewInit` | Se ejecuta una vez tras inicializar la vista del componente. |
|  | `ngAfterViewChecked` | Se ejecuta cada vez que se comprueba la vista del componente. |
| **Renderizado** | `afterNextRender` | Se ejecuta una vez la próxima vez que todos los componentes se hayan renderizado en el DOM. |
|  | `afterEveryRender` | Se ejecuta cada vez que todos los componentes se hayan renderizado en el DOM. |
| **Destrucción** | `ngOnDestroy` | Se ejecuta una vez antes de que el componente sea destruido. |

---

## **Hooks principales**

### `ngOnInit`

- Se ejecuta **una sola vez** tras que Angular haya inicializado todas las entradas del componente.
- Ocurre **antes** de que se inicialice la plantilla del componente.
- Útil para configurar el estado inicial basándose en los *inputs*.

---

### `ngOnChanges`

- Se ejecuta **cada vez** que cambian los *inputs* del componente.
- Ocurre **antes** de que se compruebe la plantilla.
- En la inicialización, el primer `ngOnChanges` se ejecuta **antes** de `ngOnInit`.
- Recibe un argumento `SimpleChanges` que es un objeto con:
    - valor anterior
    - valor actual
    - si es el primer cambio (`firstChange`)

Ejemplo:

```tsx

ngOnChanges(changes: SimpleChanges) {
  for (const prop in changes) {
    const change = changes[prop];
    console.log(`Antes ${prop}:`, change.previousValue);
    console.log(`Ahora ${prop}:`, change.currentValue);
    console.log(`Primer cambio:`, change.firstChange);
  }
}

```

---

### `ngOnDestroy`

- Se ejecuta justo antes de destruir el componente (por ejemplo, al ocultarlo o navegar a otra página).
- Alternativa: `DestroyRef`, que permite registrar *callbacks* de limpieza desde cualquier parte del código.

---

### `ngDoCheck`

- Se ejecuta **antes** de cada verificación de cambios en la plantilla del componente.
- Úsalo solo cuando sea necesario hacer comprobaciones manuales.
- Puede afectar negativamente al rendimiento si se abusa de él.
- En la inicialización, el primer `ngDoCheck` va después de `ngOnInit`.

---

### `ngAfterContentInit` y `ngAfterContentChecked`

- `ngAfterContentInit`: una vez tras inicializar el contenido proyectado (`<ng-content>`).
- `ngAfterContentChecked`: cada vez que se verifica dicho contenido.
- Cambiar estado aquí provoca `ExpressionChangedAfterItHasBeenCheckedError`.

---

### `ngAfterViewInit` y `ngAfterViewChecked`

- `ngAfterViewInit`: una vez tras inicializar la vista del componente.
- `ngAfterViewChecked`: cada vez que se verifica la vista.
- Cambiar estado aquí también provoca `ExpressionChangedAfterItHasBeenCheckedError`.

---

## **`afterEveryRender` y `afterNextRender`**

- Permiten registrar *callbacks* que se ejecutan tras renderizar **todos** los componentes.
- No son métodos de clase, sino funciones globales.
- Solo funcionan en contexto de inyección (por ejemplo, en un constructor).
- No se ejecutan en SSR ni en *build-time pre-rendering*.
- Pueden dividirse en fases:
    - `earlyRead` → leer propiedades del DOM al inicio.
    - `mixedReadWrite` → leer y escribir (por defecto).
    - `write` → escribir propiedades que afectan al layout.
    - `read` → leer propiedades después de todas las escrituras.

---

## **Interfaces de ciclo de vida**

- Angular ofrece interfaces TypeScript (`OnInit`, `OnChanges`, etc.) para cada hook.
- Implementarlas es opcional, pero ayuda a evitar errores de escritura.

Ejemplo:

```tsx

export class UserProfile implements OnInit {
  ngOnInit() {
    // inicialización
  }
}

```

---

## **Orden de ejecución**

### Inicialización:

1. `constructor`
2. `ngOnChanges`
3. `ngOnInit`
4. `ngDoCheck`
5. `ngAfterContentInit`
6. `ngAfterViewInit`
7. `ngAfterContentChecked`
8. `ngAfterViewChecked`
9. `afterNextRender`
10. `afterEveryRender`

![image.png](Ciclo%20de%20vida%2024a2f387d5c3809ab214da970ba19c85/image.png)

### Actualizaciones posteriores:

1. `ngOnChanges`
2. `ngDoCheck`
3. `ngAfterContentChecked`
4. `ngAfterViewChecked`
5. `afterEveryRender`

![image.png](Ciclo%20de%20vida%2024a2f387d5c3809ab214da970ba19c85/image%201.png)

---

## **Directivas en el mismo elemento**

- Si un elemento tiene un componente y una o más directivas, Angular **no garantiza** un orden fijo de ejecución de los hooks entre ellos.
- No dependas de un orden observado, puede cambiar en futuras versiones.