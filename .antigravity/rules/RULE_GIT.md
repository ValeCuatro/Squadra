# Reglas de Trabajo con Git y GitHub

1. **Gestión del Repositorio:** Todo el código del proyecto reside en `https://github.com/Valecuatro/Squadra.git`. Antes de comenzar a trabajar en un requerimiento, asegúrate de estar operando en base al repositorio remoto sincronizado (`git fetch` / `git pull`).
2. **Issues obligatorios:** Todo código, archivo o estructura nueva añadida al proyecto DEBE estar asociada a un [Issue] previo. No se admiten commits "aislados" sin una tarea rectora.
3. **Commits asociados:** Cuando pushees un cambio o avance, haz un commit explícito mencionando el Issue: `git commit -m "feat: [Descripción] - Resolves #<Numero issue>"`.
4. **Estructura estricta para descripción de Issues:** Al crear un Issue, SIGUE ESTE FORMATO SIEMPRE:

```markdown
### Descripción del cambio
<Descripcion de lo que pide el issue>

### Casos de prueba
<Aca escribimos tantos casos de prueba como requiera la funcionalidad>

### Documentación
<Aca explicamos muy simple lo que hicimos y que estructuras creamos, asi si algun dia falla algo podemos ver que issue lo introdujo>

### Tareas antes de cerrar el issue
- [ ] Se comprende el alcance del issue
- [ ] Se comprenden los casos de prueba
- [ ] La documentación esta actualizada
- [ ] Los casos de prueba fueron realizados por el desarrollador sin errores
```

5. **Finalización y Testeo:** No se cierra un issue hasta que se hayan verificado **todos los casos de prueba manuales o automáticos**.
