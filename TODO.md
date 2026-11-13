# Tareas de Git Money

Seguimiento de pendientes por prioridad. Las instrucciones de trabajo están en [AGENTS.md](AGENTS.md).

Revisión inicial: 10 de noviembre de 2026. Basada en los archivos del proyecto; no se ejecutaron PHP ni consultas contra la base de datos. La comprobación de sintaxis de JavaScript pasó. Contrastar siempre este diagnóstico con el código vigente.

## Objetivo y orden de trabajo acordados

Actualizado el 12 de noviembre de 2026. Git Money debe ser útil para controlar el dinero del usuario: proteger sus datos frente a otros usuarios y reducir la introducción manual de movimientos. Su objetivo profesional principal es la inteligencia artificial y el curso de especialización en IA; el desarrollo full-stack sirve de apoyo para construir y utilizar sus soluciones.

1. Completar el multiusuario con autenticación, aislamiento de datos e invitaciones, verificando la privacidad antes de compartir la aplicación.
2. Conectar Enable Banking y conseguir una sincronización bancaria fiable para el uso cotidiano. La gestión de cuentas necesaria para esa conexión forma parte de esta prioridad.
3. Mantener como objetivos confirmados crear, editar y eliminar categorías e iniciar sesión con Google. Pueden desarrollarse tras el núcleo multiusuario, pero no deben retrasar la conexión bancaria salvo dependencia real. Los gráficos, presupuestos y demás ampliaciones tampoco bloquean estas prioridades.
4. El proyecto de IA se planifica y desarrolla por separado. Cuando esté terminado o suficientemente avanzado y evaluado, integrarlo mediante una API propia en Python para hacer más cómodo el uso de Git Money.

Git Money debe seguir siendo útil y funcional sin IA. No es necesario completar todas las mejoras secundarias antes de empezar el proyecto de IA.

## Objetivos principales de la primera versión

Estos objetivos definen el alcance prioritario. Los objetivos secundarios no amplían los requisitos de esta primera versión. Si alguna tarea secundaria es necesaria para completar un objetivo principal, se abordará como parte de ese objetivo.

- [x] Registrar ingresos y gastos en PostgreSQL.
- [x] Recuperar los movimientos correctamente al recargar la página. Carga desde PostgreSQL confirmada por el usuario en el navegador el 10 de noviembre de 2026; no se han verificado los casos de error.
- [x] Mostrar categorías, ingresos, gastos y balance. El usuario confirma la carga correcta de movimientos y la coincidencia de las tarjetas con los datos guardados el 10 de noviembre de 2026. No se han comprobado los casos de error.
- [x] Editar y eliminar movimientos.
- [x] Filtrar movimientos por tipo.
- [x] Filtrar movimientos por fechas. El usuario comprobó el filtro Desde/Hasta y su estado sin coincidencias en el navegador.
- [x] Tener una interfaz usable y mensajes claros cuando algo falle. Avisos en la página y el formulario, conservación de los datos ante un error y bloqueo de peticiones repetidas. Verificado con fallos simulados.
- [x] Adaptar Git Money a móvil. Resumen, filtros, movimientos y formularios adaptados a pantallas pequeñas, con Editar y Borrar siempre visibles en móvil y pantallas táctiles. Verificado en Chrome a 320, 390 y 600 px con respuestas simuladas. Queda la comprobación en un teléfono físico.
  - [x] Arreglar el desborde de los campos Fecha y Hora del formulario en móviles. El usuario confirmó en un iPhone que ambos campos se ven completos al registrar un ingreso y al editar un movimiento, y que los dos selectores se abren. El ajuste usa `display: block` y `appearance: none` en móvil.

## Objetivos secundarios

Se conserva el detalle técnico de la revisión inicial para consultar dependencias y planificar mejoras posteriores. Estos puntos no son requisitos adicionales para dar por terminada la primera versión.

### 1. Sincronización de la interfaz y persistencia

- [x] Mostrar movimientos y recalcular tarjetas después de cargar los datos del servidor. Verificado por el usuario en el navegador el 10 de noviembre de 2026.
- [x] Coordinar la carga de categorías y movimientos antes de dibujar la tabla. `iniciarPagina()` inicia ambas peticiones en paralelo con `Promise.all()` y espera a que terminen; el usuario confirma que los movimientos se muestran correctamente al recargar.
- [x] Normalizar importes e identificadores recibidos para evitar errores de cálculo, formato y comparación. Revisado en cargarMovimientos(): importe con Number() y categoría con String(). El usuario confirma la carga de movimientos y los totales de las tarjetas en el navegador.
- [x] Gestionar categorías no encontradas sin interrumpir el dibujado de la tabla. Comprobado con una categoría ausente en una prueba simulada.
- [x] Esperar la confirmación del guardado antes de añadir el movimiento a la interfaz y cerrar el formulario. El usuario confirma las pruebas de guardado correcto y servidor detenido el 10 de noviembre de 2026: si falla, se conserva el formulario y no se añade la fila.
- [x] Devolver y conservar el ID del movimiento creado.
- [x] Mostrar errores de carga, guardado, edición y borrado en pantalla, conservar el formulario si falla y evitar envíos repetidos durante la petición. Comprobado con fallos de red, respuestas HTTP de error y peticiones pendientes simuladas.
- [x] Mantener el formato HH:mm de la hora antes y después de recargar. cargarMovimientos() aplica slice(0, 5); corrección confirmada por el usuario el 10 de noviembre de 2026.

### 2. Gestión de movimientos

- [x] Implementar la edición de movimientos con persistencia en la base de datos. El usuario comprobó el guardado de ingresos y gastos en el navegador. Se revisó en código que el ajuste final usa los mismos valores de procedencia y medio de pago en el `UPDATE` y en la respuesta, y PHP pasó la comprobación de sintaxis.
- [x] Implementar la eliminación con confirmación y actualización de tabla y totales. El usuario verificó el borrado en PostgreSQL, la respuesta 404 para un ID ya borrado y la actualización de la interfaz.
- [x] Aplicar la clase compartida `boton-tabla` a Editar y Borrar. Verificado en JavaScript.
- [x] Conectar el evento de Borrar.
- [x] Conectar el evento de Editar para abrir el formulario con los datos básicos de la fila. Comprobado por el usuario en el navegador.
- [x] Mostrar las acciones sobre el importe al pasar el ratón por la fila. Comprobado por el usuario en el navegador.
- [x] Comprobar que Editar y Borrar aparecen al llegar a sus botones con Tab. El usuario confirmó que `:focus-visible` funciona.
- [x] Adaptar los botones de Editar y Borrar a móvil y pantallas táctiles. Controles visibles y de al menos 44 px de ancho en las pruebas de Chrome con pantalla estrecha.
- [x] Recuperar las notas guardadas para rellenar el formulario de edición. Comprobado por el usuario tras recargar la página.
- [x] Precargar el medio de pago al editar gastos con valores antiguos como `Efectivo`. Una prueba en Node verificó que `Efectivo` y `efectivo` coinciden con la opción del formulario, y que un valor ausente selecciona la opción vacía. Queda la prueba en navegador dentro del flujo completo.
- [x] Distinguir la ausencia de movimientos de la ausencia de resultados del filtro.
- [x] Hacer que el mensaje de tabla vacía ocupe las cinco columnas. Verificado en JavaScript.

### 3. Cuentas, categorías y validaciones

- [x] Permitir seleccionar la cuenta del movimiento en lugar de fijar su ID en 1.
- [ ] Gestionar cuentas y calcular saldos incluyendo el saldo inicial.

La gestión de categorías se detalla más abajo; su aislamiento por usuario forma parte del núcleo multiusuario.

- [ ] Filtrar las categorías por el usuario correspondiente en PHP.
- [x] Completar en el alta la validación de que la categoría corresponde al tipo de movimiento y al usuario. El usuario comprobó la validación. La revisión del código confirma que el error `400` devuelve un objeto JSON con la propiedad `mensaje`. La edición ya comprueba el tipo y el usuario en el `UPDATE`.
- [x] Completar las validaciones del servidor: fecha, hora, identificadores, longitudes, notas y límites del importe. La fecha y la hora ya se validan en el alta y en la edición. Las comprobaciones pasaron pruebas aisladas en PHP con fechas válidas, bisiestas e imposibles, horas válidas y fuera de rango, formatos incorrectos y valores que no eran texto. El ID de categoría también se valida en ambos endpoints. Las pruebas aisladas cubrieron el formato y el rango de `INTEGER` de PostgreSQL para los IDs positivos. El concepto se limita a 200 caracteres y la procedencia de los ingresos a 50, después de quitar los espacios de los extremos. Las pruebas aisladas con texto acentuado confirmaron ambos límites en el alta y en la edición. En ambos archivos, las notas admiten el campo ausente, `null` o texto de hasta 500 caracteres. Las pruebas aisladas confirmaron el límite y el rechazo de arrays.
  - El importe se valida en el alta y en la edición. Las pruebas aisladas en PHP cubrieron importes enteros, decimales, fuera de rango y valores no numéricos. En la edición, el ID del movimiento debe ser un entero entre 1 y 2147483647. El bloque pasó pruebas aisladas de tipo y rango en PHP.
- [x] Recoger la procedencia del ingreso y el medio de pago del gasto en el formulario, validarlos en PHP y guardar los valores elegidos en PostgreSQL. El usuario confirmó la prueba de guardado de ambos tipos el 11 de noviembre de 2026. No es necesario mostrar estos campos en la tabla principal.

### 4. Pantallas y funciones previstas

- [ ] Crear la pantalla Movimientos y conectar la navegación.
- [x] Añadir un filtro por intervalo de fechas.
- [x] Mostrar un aviso específico cuando la fecha Desde sea posterior a la fecha Hasta. El usuario comprobó el cambio.
- [ ] Añadir filtros rápidos por día, semana, mes o año.
- [ ] Añadir un selector de periodo y definir su efecto sobre los resúmenes.
- [ ] Añadir gráficos y desglose de gastos por categoría. La propuesta original plantea Canvas o SVG sin librerías externas.
- [ ] Añadir presupuestos por categoría y alertas de límite de gasto, previstos en la propuesta original.
- [ ] Añadir exportación e importación JSON o CSV, previstas en la propuesta original.

### 5. Calidad y preparación para portfolio

- [ ] Revisar los scripts SQL: separar apuntes y pruebas, corregir instrucciones incompatibles con el esquema actual y el ALTER TABLE incorrecto.
- [ ] Preparar una instalación reproducible con esquema definitivo y datos iniciales separados de las pruebas.
- [ ] Actualizar el diagrama y la documentación para reflejar el esquema actual.
- [ ] Crear un README con requisitos, configuración, arranque, capturas y funciones disponibles.
- [ ] Retirar credenciales de prueba del SQL y configurar un usuario de base de datos con permisos adecuados en lugar de usar postgres.
- [ ] Revisar la accesibilidad. El usuario ya comprobó con el teclado los indicadores de foco de Editar y Borrar en la tabla.
- [ ] Resolver las opciones provisionales de Configuración, Ayuda y Salir, y los datos de usuario de ejemplo según el alcance acordado.
- [x] Verificar el flujo completo de guardar, recargar, filtrar, editar y eliminar, incluyendo errores de conexión y revisión en móvil. El usuario confirmó el flujo normal en el PC y en el iPhone con un gasto de prueba. También confirmó en el iPhone que, al intentar guardar sin conexión, aparece el aviso, se conservan los datos y se puede reintentar al recuperar la conexión sin duplicar el gasto.
- [ ] Hacer que el flujo de despliegue se detenga si falla una comprobación de sintaxis antes de generar el paquete.

## Prioridad 1: privacidad y núcleo multiusuario

Alcance confirmado el 12 de noviembre de 2026: permitir que un grupo reducido de personas autorizadas utilice Git Money de forma privada y gratuita, con datos independientes. Completar y verificar el núcleo multiusuario (etapas 1–6) antes de conectar datos bancarios reales. Las categorías y Google se conservan como ampliaciones confirmadas, sin bloquear Enable Banking salvo dependencia técnica.

Estimación orientativa del multiusuario básico con explicaciones y pruebas: 15–25 horas de trabajo efectivo. Esta estimación no incluye la gestión completa de categorías, el acceso con Google ni Enable Banking; revisar el total al concretar estas ampliaciones.

### 1. Preparar y conservar los datos (1–2 h)

- [ ] Hacer una copia de seguridad y contrastar el esquema versionado con la base de datos instalada.
- [ ] Preparar la migración conservando los movimientos, cuentas y categorías actuales asociados al usuario propietario.
- [ ] Revisar la tabla de usuarios y el almacenamiento de hashes de contraseñas.

### 2. Inicio y cierre de sesión (3–4 h)

- [ ] Implementar inicio de sesión con correo y contraseña y cierre de sesión.
- [ ] Gestionar la identidad desde la sesión del servidor, sin confiar en un ID de usuario enviado por el navegador.
- [ ] Proteger los endpoints PHP que leen o modifican datos privados y rechazar solicitudes sin sesión válida.

### 3. Separar los datos de cada usuario (2–4 h)

- [ ] Sustituir el usuario fijo 1 en listar, guardar, editar y borrar movimientos por el usuario autenticado.
- [ ] Filtrar las categorías por el usuario autenticado.
- [ ] Validar en el servidor la propiedad de cuentas, categorías y movimientos y la correspondencia entre categoría y tipo de movimiento.
- [ ] Resolver la cuenta de cada usuario sin utilizar la cuenta fija 1. Empezar con una cuenta financiera inicial por usuario; la gestión de varias cuentas necesaria para Enable Banking se abordará en la fase bancaria.

### 4. Altas privadas y gestión de usuarios (3–5 h)

- [ ] Crear cuentas de usuario únicamente mediante invitaciones de un solo uso y con caducidad.
- [ ] Crear una cuenta financiera y categorías iniciales propias para cada nuevo usuario.
- [ ] Implementar una gestión sencilla de usuarios e invitaciones.
- [ ] Permitir revocar el acceso a un usuario, incluyendo sus sesiones activas.

### 5. Adaptar la interfaz (2–3 h)

- [ ] Crear la pantalla de acceso, mostrar el nombre del usuario y conectar el botón Salir.
- [ ] Gestionar sesiones caducadas y limpiar los datos visibles del usuario al cerrar o cambiar de sesión.
- [ ] Comprobar los nuevos formularios y mensajes en móvil.

### 6. Seguridad, pruebas y despliegue (4–7 h)

- [ ] Configurar las sesiones y cookies de forma segura, revisar HTTPS y añadir protección CSRF a las operaciones que modifican datos.
- [ ] Limitar los intentos de inicio de sesión y comprobar los mensajes de error.
- [ ] Probar con dos usuarios que ninguno puede listar, crear, editar o borrar datos utilizando cuentas, categorías o movimientos ajenos, incluso manipulando los IDs de las peticiones.
- [ ] Comprobar las solicitudes sin autenticar, las sesiones caducadas y el acceso revocado.
- [ ] Verificar guardar, recargar, filtrar, editar y borrar con ambas cuentas, conservando los datos existentes.
- [ ] Desplegar y verificar la versión multiusuario antes de dar acceso a amigos.

## Ampliaciones confirmadas: categorías y acceso con Google

Estas funciones siguen previstas; la privacidad y la sincronización bancaria tienen prioridad. Implementar antes de la conexión bancaria solo lo que sea necesario para utilizarla correctamente.

### Crear, editar y eliminar categorías

- [ ] Añadir la interfaz y los endpoints para crear categorías propias de ingreso o gasto.
- [ ] Permitir editar las categorías propias con validación del nombre y del tipo.
- [ ] Permitir eliminar categorías propias con confirmación.
- [ ] Definir y aplicar el tratamiento de categorías con movimientos: bloquear el borrado o exigir reasignación compatible, sin eliminar movimientos.
- [ ] Impedir cambios de tipo incompatibles con movimientos existentes.
- [ ] Actualizar los selectores y la tabla tras los cambios y comprobar el aislamiento entre usuarios.

### Iniciar sesión con Google

- [ ] Configurar el acceso con Google y las direcciones de retorno para el entorno de desarrollo y el despliegue.
- [ ] Implementar y validar la identidad de Google en el servidor y asociarla de forma segura a una cuenta local.
- [ ] Definir la vinculación de Google con cuentas existentes evitando duplicados y vinculaciones basadas únicamente en un correo recibido del navegador.
- [ ] Mantener el acceso por invitación: iniciar sesión con Google no debe permitir registrarse sin autorización.
- [ ] Aplicar las mismas reglas de sesión, aislamiento y revocación que al acceso con correo y contraseña.
- [ ] Probar el primer acceso, accesos posteriores, cancelaciones, errores y usuarios no invitados.

## Prioridad 2: integración con Enable Banking

Objetivo confirmado el 12 de noviembre de 2026: conectar los bancos después de verificar el núcleo multiusuario, para controlar el dinero sin introducir manualmente cada movimiento. La disponibilidad y las condiciones del proveedor deben comprobarse antes de comprometer la integración.

- [ ] Verificar las condiciones vigentes de Enable Banking: disponibilidad de BBVA y Revolut, requisitos de acceso, costes, entorno de pruebas y viabilidad para una aplicación privada con varios usuarios.
- [ ] Definir el alcance inicial de lectura de cuentas, saldos y movimientos y su correspondencia con los datos actuales de Git Money.
- [ ] Adaptar la gestión de cuentas y saldos a varias cuentas bancarias por usuario, distinguiendo saldos del banco y cálculos internos.
- [ ] Realizar una primera prueba en el entorno de pruebas antes de conectar cuentas reales.
- [ ] Implementar la autorización y el consentimiento bancario de cada usuario, almacenando credenciales y tokens únicamente en el servidor.
- [ ] Asociar cada conexión y cuenta bancaria a su propietario y garantizar el aislamiento entre usuarios.
- [ ] Importar movimientos sin duplicarlos al repetir la sincronización y definir cómo convivirán con los registros manuales.
- [ ] Definir e implementar la sincronización periódica de movimientos dentro de los límites del proveedor, con actualización manual y fecha de última sincronización visible. Tener en cuenta que el servidor local debe estar encendido.
- [ ] Gestionar errores, caducidad y renovación del consentimiento y desconexión del banco.
- [ ] Verificar importaciones repetidas, movimientos pendientes y confirmados, transferencias entre cuentas propias y conservación de correcciones del usuario para evitar duplicados y totales engañosos.
- [ ] Probar el flujo completo antes de habilitarlo para otros usuarios.

## Integración futura con el proyecto independiente de IA

El aprendizaje de Python, los retos, los modelos y su planificación se trasladan al documento independiente `Proyecto_IA_Python.md`, para otro proyecto de ChatGPT. Mantener aquí únicamente el trabajo de integración de Git Money.

- [ ] Integrar el modelo cuando el proyecto independiente esté terminado o suficientemente avanzado y evaluado.
- [ ] Conectar Git Money mediante una API propia en Python, diseñada e implementada como parte del aprendizaje del proyecto de IA.
- [ ] Definir el contrato entre PHP y la API, con autenticación, permisos, validación y tratamiento de errores.
- [ ] Mostrar inicialmente sugerencias que el usuario pueda aceptar o corregir.
- [ ] Mantener Git Money y la sincronización bancaria operativos si la API de IA falla o está detenida.

## Ideas opcionales, sin prioridad comprometida

- [ ] Modo oscuro.
- [ ] Buscaminas como extra independiente.

## Apuntes de aprendizaje

Los comentarios didácticos de JavaScript y PHP se han resumido, junto con los apuntes SQL, en [Apuntes_Git_Money.pdf](output/pdf/Apuntes_Git_Money.pdf). Se mantienen comentarios sobre el propósito de los bloques y las decisiones del proyecto. Esta limpieza no resuelve ni marca como completadas las tareas funcionales.
