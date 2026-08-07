# FP-018.1 — Fix ESLint static-components

Corrige `react-hooks/static-components` en el timeline de `Mis avistamientos`.

La función anterior devolvía referencias a componentes de Lucide durante el
render (`Send`, `XCircle`, etc.) y después se instanciaban como `<Icon />`.

La corrección devuelve directamente los elementos JSX desde una función de
render, evitando crear/seleccionar un componente dinámico durante el render.

No cambia datos, RPCs, traducciones ni comportamiento funcional.
