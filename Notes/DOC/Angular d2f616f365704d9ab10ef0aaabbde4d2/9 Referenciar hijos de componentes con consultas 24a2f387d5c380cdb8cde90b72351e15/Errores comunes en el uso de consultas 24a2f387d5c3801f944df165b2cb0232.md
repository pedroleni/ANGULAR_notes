# Errores comunes en el uso de consultas

Al trabajar con consultas, hay errores habituales que pueden dificultar el mantenimiento y comprensión del código:

1. **No mantener una única fuente de la verdad**
    
    Siempre centraliza el estado compartido entre varios componentes para evitar que se desincronicen.
    
2. **Evitar escribir estado directamente en componentes hijos**
    
    Este patrón puede generar código frágil y propenso a errores como `ExpressionChangedAfterItHasBeenChecked`.
    
3. **Nunca escribir estado directamente en componentes padre o ancestros**
    
    Este patrón también lleva a código frágil, difícil de entender y con riesgo de `ExpressionChangedAfterItHasBeenChecked`.
    

---

Si quieres, puedo prepararte un **cuadro comparativo** con todos los métodos de consulta (`viewChild`, `contentChild`, `ViewChild`, `ContentChildren`, etc.) con sus diferencias, opciones disponibles y momento del ciclo de vida en que están listos.

¿Quieres que lo arme?