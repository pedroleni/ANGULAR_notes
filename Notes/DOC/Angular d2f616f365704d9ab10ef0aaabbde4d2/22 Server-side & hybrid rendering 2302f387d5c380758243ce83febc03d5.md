# 22. Server-side & hybrid rendering

## **Qué es Server-side rendering (SSR)**

Es cuando Angular **no espera a que el navegador monte la página**, sino que **la prepara en el servidor** y envía al usuario el HTML ya listo para mostrar.

- El usuario ve la página casi al instante.
- Google y otros buscadores la pueden indexar mejor.
- El servidor hace el trabajo pesado, no el móvil del usuario.

---

## **Qué es Hybrid rendering**

Es usar **varias formas de renderizar** en la misma app según lo que convenga:

- **SSR** para páginas que cambian según el usuario (perfil, carrito de compra, etc.).
- **Prerender (SSG)** para páginas fijas (landing, “sobre nosotros”).
- **CSR** (lo de siempre) para contenido muy interactivo o que no necesita carga previa del servidor.

---

## **Por qué mezclar modos**

Porque así **solo usas el servidor cuando vale la pena** y ahorras recursos, pero sigues dando una buena experiencia al usuario:

- Rápido donde importa (portada, producto, blog).
- Ligero donde no pasa nada si tarda más (zonas internas, panel de control).
- Mejor SEO en páginas críticas.

[**Server-side & hybrid rendering**](22%20Server-side%20&%20hybrid%20rendering%202302f387d5c380758243ce83febc03d5/Server-side%20&%20hybrid%20rendering%2024b2f387d5c38069a7c5ef134cbfc400.md)

[**Hidratación (Hydration)**](22%20Server-side%20&%20hybrid%20rendering%202302f387d5c380758243ce83febc03d5/Hidrataci%C3%B3n%20(Hydration)%2024b2f387d5c380f5a1e1d7ff92f64ef6.md)

[Hidratación incremental](22%20Server-side%20&%20hybrid%20rendering%202302f387d5c380758243ce83febc03d5/Hidrataci%C3%B3n%20incremental%2024b2f387d5c380a5842ff100b1257b77.md)