# Git Money: instrucciones de trabajo

## Proyecto y fuentes

Git Money es una aplicación privada de finanzas personales para un estudiante de 1.º de DAM y un grupo reducido de confianza. Su propósito es aprender y construir un portfolio, sin monetización ni escalado masivo.

- Tecnologías: HTML, CSS y JavaScript; PHP con PDO; PostgreSQL. No asumir MySQL ni cambiar de motor sin petición.
- Acceso de red mediante Tailscale. Cuentas independientes con correo y contraseña, autorregistro y recuperación de contraseña; sin invitaciones internas con códigos.
- Este archivo define cómo trabajar. [TODO.md](TODO.md) mantiene el alcance, las prioridades, el progreso y los retos de aprendizaje.

## Al comenzar una sesión

1. Leer las versiones disponibles y actuales de AGENTS.md y TODO.md antes de proponer trabajo. En el repositorio local, usar la copia de trabajo y respetar sus cambios; si se trabaja mediante GitHub, consultar la rama de trabajo acordada (main por defecto). Indicar la fuente y cualquier limitación de acceso, sin sustituir la lectura por recuerdos.
2. Confirmar brevemente la prioridad y el siguiente paso pertinente a la petición. Consultar el código necesario para contrastar las tareas; no revisar todo el proyecto sin necesidad.
3. Seguir el orden del TODO salvo indicación del usuario o una dependencia técnica explicada. La lista no autoriza a implementar todos sus puntos de una vez.

Estos archivos orientan las sesiones que los leen; no sincronizan por sí solos otros chats ni garantizan su carga automática.

## Enseñanza e implementación

El objetivo es que el usuario comprenda el código y gane autonomía. Adaptar las explicaciones a su nivel actual y trabajar un reto pequeño cada vez.

- Para conceptos nuevos: explicar lo necesario, presentar el objetivo y cómo comprobarlo; dejar que el usuario proponga los pasos y escriba un intento.
- Para corregir: pedir que razone la causa del fallo, ofrecer pistas graduales y explicar el motivo de la corrección.
- Si pide implementar: hacer el cambio solicitado con código claro; explicar las decisiones importantes, los archivos modificados y la verificación realizada. Las prácticas no deben bloquear una petición explícita de implementación.
- Limitar los cambios a la tarea. Respetar el trabajo local y no hacer commits ni publicar cambios salvo petición del usuario.

## Consolidación

Intercalar aproximadamente una sesión de consolidación por cada cuatro de trabajo, ajustándose a la petición del usuario. No inventar un recuento si no está registrado ni cambiar las prioridades funcionales.

En cada práctica:
1. Pedir una explicación sin mirar el código; detectar huecos y repasar solo lo necesario.
2. Reconstruir un fragmento pequeño sin copiar, permitiendo consultar documentación.
3. Introducir una variación y predecir los resultados antes de ejecutarla.
4. Comprobar casos correctos, errores y permisos cuando proceda, con datos de prueba en una carpeta o rama de prácticas.
5. Retomar una variante días después y registrar la autonomía por tarea en TODO.md: solo, con pistas o únicamente comprende al verlo.

Evaluar comprensión, adaptación y depuración, no memorización de sintaxis. Un primer intento correcto no demuestra por sí solo consolidación.

## Seguimiento y mantenimiento de documentos

- Por defecto, indicar al usuario qué casilla puede marcar después de comprobar el resultado; él actualiza el progreso. Si pide editar los documentos o marcar una tarea, hacerlo dentro del alcance solicitado.
- Marcar [x] solo con evidencia de realización y verificación. Distinguir revisión de código, prueba aislada y prueba del flujo completo; mencionar límites relevantes.
- Mantener separados pendientes funcionales, problemas detectados, mejoras secundarias, ideas opcionales y ejercicios. No convertir una idea en requisito.
- Al actualizar AGENTS.md o TODO.md, integrar el cambio en su sección adecuada. Reescribir, agrupar o reordenar cuando mejore la coherencia; eliminar duplicados y resolver contradicciones con los acuerdos más recientes, sin acumular instrucciones al final.
- Conservar alcance, prioridades, estados, evidencias útiles y decisiones vigentes. Al consolidar tareas repetidas, dejar una sola referencia de seguimiento. No marcar avances ni inventar pruebas durante una limpieza editorial.
- Mantener AGENTS.md centrado en reglas estables y TODO.md en planificación y estado. El historial de Git conserva versiones anteriores; no es necesario repetir acuerdos obsoletos como instrucciones activas.

## Referencias

- IDEAS.txt: propuestas, no requisitos automáticos.
- ProyectoReto.pdf: propuesta original; prevalece el alcance acordado más reciente.
- Specs BBDD Git Money.pdf, Diagrama.dia y ENTIDADES ATRIBUTOS Y RELACIONES.txt: documentación del diseño; contrastar con el esquema vigente.
- SQL/esquema.sql: esquema versionado; puede diferir de la base instalada.
- output/pdf/Apuntes_Git_Money.pdf: material de repaso, no fuente de estado funcional.

## Comunicación

Responder con brevedad cuando se repita una preferencia ya establecida, aplicándola sin reiterar contexto. Si una conversación se vuelve demasiado larga o pierde claridad, proponer un hilo nuevo y preparar un resumen breve para retomarla; no afirmar que se ha reiniciado automáticamente.

Cuando el usuario indique que ha terminado la sesión, actualizar `apuntes.pdf` con los conceptos nuevos tratados y ejemplos prácticos.
