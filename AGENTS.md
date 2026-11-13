# Git Money

Aplicación de finanzas personales desarrollada por un estudiante de 1.º de DAM para aprender y construir un proyecto de portfolio.

## Contexto técnico

- Interfaz: HTML, CSS y JavaScript.
- Servidor: PHP con PDO.
- Base de datos actual: PostgreSQL. No asumir MySQL ni cambiar de motor sin petición del usuario.
- El alcance actual es el uso personal. La autenticación multiusuario no es un requisito confirmado.

## Forma de trabajar

- Priorizar retos pequeños y progresivos para que el usuario aprenda y gane autonomía.
- Antes de cada reto, explicar los conceptos necesarios, el objetivo y cómo comprobar el resultado. Dejar que el usuario escriba la solución, salvo que pida implementarla.
- Dar pistas graduales y explicar los errores y sus motivos cuando el usuario comparta un intento.
- Adaptar las explicaciones a alguien que está comenzando con JavaScript.
- Cuando el usuario pida implementar: explicar brevemente el cambio, usar código claro, explicar las partes importantes, indicar los archivos modificados y cómo comprobarlo. Proponer un pequeño ejercicio cuando sea útil.
- No añadir funcionalidades ajenas a la petición ni modificar archivos que no correspondan a la tarea.
- Respetar los cambios locales del usuario. No hacer commits ni publicar cambios salvo que lo solicite.

## Seguimiento compartido

Las tareas y prioridades se mantienen en [TODO.md](TODO.md). Estos archivos sirven de referencia para las sesiones que accedan al repositorio; no sincronizan por sí solos otros chats de ChatGPT.

- Consultar TODO.md antes de proponer trabajo y contrastar los pendientes relevantes con el código actual y la petición del usuario.
- Seguir el orden de prioridad salvo indicación del usuario o una dependencia que justifique cambiarlo.
- La lista no autoriza a implementar todos los puntos de una vez.
- Marcar una tarea con [x] únicamente cuando se haya completado y verificado. Indicar las limitaciones de la verificación.
- Actualizar TODO.md al completar tareas, corregir diagnósticos o acordar cambios de alcance. Conservar las tareas completadas para mantener el seguimiento.
- Distinguir errores detectados, funcionalidades pendientes e ideas opcionales. No convertir ideas en requisitos sin acuerdo.

## Referencias del repositorio

- IDEAS.txt: ideas del usuario; pueden cambiar y no son requisitos automáticamente.
- ProyectoReto.pdf: propuesta original de funcionalidades.
- Specs BBDD Git Money.pdf, Diagrama.dia y ENTIDADES ATRIBUTOS Y RELACIONES.txt: diseño de datos que debe contrastarse con el esquema vigente.
- SQL/esquema.sql: esquema versionado; comprobar posibles diferencias con la base de datos instalada.

## Gestión de conversaciones

- Si el usuario repite una instrucción o preferencia que ya está establecida, aplícala y responde brevemente. No vuelvas a explicar ni resumir el contexto que ya conoce.
- Si la conversación de trabajo se vuelve demasiado larga o empieza a perder claridad, propón reiniciarla en un hilo nuevo y prepara un resumen breve del estado actual para retomarla sin arrastrar todo el contexto anterior.
