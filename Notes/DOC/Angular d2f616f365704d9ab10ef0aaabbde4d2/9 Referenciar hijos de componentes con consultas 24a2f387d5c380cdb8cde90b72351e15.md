# 9. Referenciar hijos de componentes con consultas

Un componente puede definir **consultas** (*queries*) para encontrar elementos hijos y leer valores desde sus inyectores.

Los desarrolladores usan consultas principalmente para obtener referencias a **componentes hijos, directivas, elementos del DOM**, y más.

Todas las funciones de consulta devuelven **signals** que reflejan los resultados más recientes.

Puedes leer el resultado llamando a la función *signal*, incluso en contextos reactivos como `computed` y `effect`.

Existen **dos categorías** de consultas:

- **Consultas de vista** (*view queries*)
- **Consultas de contenido** (*content queries*)

---

[**Consultas de vista (View queries)**](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Consultas%20de%20vista%20(View%20queries)%2024a2f387d5c3803387d8db7d23b77e03.md)

[**Consultas de contenido (Content queries)**](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Consultas%20de%20contenido%20(Content%20queries)%2024a2f387d5c38021b2bcd78df16327f1.md)

[**Consultas obligatorias (Required queries)**](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Consultas%20obligatorias%20(Required%20queries)%2024a2f387d5c3803ab3f5d06f6b68db83.md)

[**Localizadores en consultas (Query locators)**](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Localizadores%20en%20consultas%20(Query%20locators)%2024a2f387d5c380088084d8a157c4ecdb.md)

[**Opciones de consulta (Query options)**](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Opciones%20de%20consulta%20(Query%20options)%2024a2f387d5c380c9b147db14cebee6a9.md)

[**Consultas basadas en decoradores**](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Consultas%20basadas%20en%20decoradores%2024a2f387d5c3805ab5d7ce4e1e2f486a.md)

[**Errores comunes en el uso de consultas**](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Errores%20comunes%20en%20el%20uso%20de%20consultas%2024a2f387d5c3801f944df165b2cb0232.md)

[ Resumen con un elemento input](9%20Referenciar%20hijos%20de%20componentes%20con%20consultas%2024a2f387d5c380cdb8cde90b72351e15/Resumen%20con%20un%20elemento%20input%2022e2f387d5c38072bb78e932a60829df.md)