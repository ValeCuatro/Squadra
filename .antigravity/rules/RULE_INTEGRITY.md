# Reglas de Integridad del Frontend y Lógica

1. **Reutilización y Consistencia Visual:** Para mantener un producto robusto y evitar "alucinaciones" al escribir código de interfaces (generar UI innecesariamente variada), si un componente (Botón, Tarjeta, Layout, Endpoints de API, Queries DB) o lógica de dominio ya se desarrolló, **DEBE REUTILIZARSE**.  
2. **Sincronización End-to-End:** 
   - No hardcodear datos, tipos, ni variaciones mágicas en las UI. 
   - La integridad empieza desde el Frontend pidiendo a una `API Route`, que a su vez se comunica a través del ORM tipado (Prisma). Todo debe utilizar los mismos esquemas/tipos unificados exportados por el sistema (ej. tipos inferidos de Prisma, schemas de Zod).
3. **Cero Duplicación Injustificada:** Antes de crear una nueva función utilitaria, un nuevo estado y sobre todo un nuevo Componente visual, busca el existente y parametrizalo si le falta algún estado. Esto asegura coherencia estética (derivada del MCP Stitch original) y prevé regresiones.
4. **Integridad de Modelos (Base de Datos a UI):** Si cambia un campo en la Base de Datos o backend, dicho cambio debe propagarse hacia arriba afectando Server Actions y componentes para evitar inconsistencias silenciosas.
