# Tareas de Git Money

Seguimiento de pendientes por prioridad. Las instrucciones de trabajo están en [AGENTS.md](AGENTS.md).

Revisión inicial: 10 de noviembre de 2026. Basada en los archivos del proyecto; no se ejecutaron PHP ni consultas contra la base de datos. La comprobación de sintaxis de JavaScript pasó. Contrastar siempre este diagnóstico con el código vigente.

## Objetivos principales de la primera versión

Estos seis objetivos definen el alcance prioritario. Los objetivos secundarios no amplían los requisitos de esta primera versión. Si alguna tarea secundaria es necesaria para completar un objetivo principal, se abordará como parte de ese objetivo.

- [ ] Registrar ingresos y gastos en PostgreSQL.
- [x] Recuperar los movimientos correctamente al recargar la página. Carga desde PostgreSQL confirmada por el usuario en el navegador el 10 de noviembre de 2026; no se han verificado los casos de error.
- [x] Mostrar categorías, ingresos, gastos y balance. El usuario confirma la carga correcta de movimientos y la coincidencia de las tarjetas con los datos guardados el 10 de noviembre de 2026. No se han comprobado los casos de error.
- [ ] Editar y eliminar movimientos.
- [ ] Filtrar movimientos por tipo y por fechas.
- [ ] Tener una interfaz usable y mensajes claros cuando algo falle.

## Objetivos secundarios

Se conserva el detalle técnico de la revisión inicial para consultar dependencias y planificar mejoras posteriores. Estos puntos no son requisitos adicionales para dar por terminada la primera versión.

### 1. Sincronización de la interfaz y persistencia

- [x] Mostrar movimientos y recalcular tarjetas después de cargar los datos del servidor. Verificado por el usuario en el navegador el 10 de noviembre de 2026.
- [x] Coordinar la carga de categorías y movimientos antes de dibujar la tabla. iniciarPagina() espera ambas cargas en orden; el usuario confirma que los movimientos se muestran correctamente al recargar.
- [x] Normalizar importes e identificadores recibidos para evitar errores de cálculo, formato y comparación. Revisado en cargarMovimientos(): importe con Number() y categoría con String(). El usuario confirma la carga de movimientos y los totales de las tarjetas en el navegador.
- [ ] Gestionar categorías no encontradas sin interrumpir el dibujado de la tabla.
- [x] Esperar la confirmación del guardado antes de añadir el movimiento a la interfaz y cerrar el formulario. El usuario confirma las pruebas de guardado correcto y servidor detenido el 10 de noviembre de 2026: si falla, se conserva el formulario y no se añade la fila.
- [ ] Devolver y conservar el ID del movimiento creado.
- [ ] Mostrar errores de carga y guardado en pantalla, conservar el formulario si falla y evitar envíos repetidos durante la petición. El usuario confirma el aviso de fallo de guardado, la conservación del formulario y la disponibilidad del botón para reintentar. Revisado el bloqueo con disabled durante el envío; pendientes los errores de carga y una prueba específica de envíos repetidos con respuesta lenta.
- [x] Mantener el formato HH:mm de la hora antes y después de recargar. cargarMovimientos() aplica slice(0, 5); corrección confirmada por el usuario el 10 de noviembre de 2026.

### 2. Gestión de movimientos

- [ ] Implementar la edición de movimientos con persistencia en la base de datos.
- [ ] Implementar la eliminación con confirmación y actualización de tabla y totales.
- [ ] Conectar los eventos de Editar y Borrar y corregir la clase que se aplica dos veces a Editar.
- [ ] Revisar la visibilidad de las acciones y permitir su uso con ratón, teclado y pantalla táctil.
- [ ] Recuperar las notas para los detalles o la edición; no es necesario añadirlas a la tabla principal.
- [ ] Corregir el colSpan del estado vacío de cuatro a cinco columnas y distinguir ausencia de movimientos de ausencia de resultados del filtro.

### 3. Cuentas, categorías y validaciones

- [ ] Permitir seleccionar la cuenta del movimiento en lugar de fijar su ID en 1.
- [ ] Gestionar cuentas y calcular saldos incluyendo el saldo inicial.
- [ ] Permitir gestionar categorías desde la aplicación.
- [ ] Filtrar las categorías por el usuario correspondiente en PHP.
- [ ] Validar en el servidor que la categoría corresponde al tipo de movimiento y al usuario.
- [ ] Completar las validaciones del servidor: fecha, hora, identificadores, longitudes, notas y límites del importe.
- [ ] Conservar procedencia y medio de pago según la decisión del usuario; definir cómo recogerlos sin complicar la primera versión y sustituir los valores fijos de prueba. No es necesario mostrar estos campos en la tabla principal.

### 4. Pantallas y funciones previstas

- [ ] Crear la pantalla Movimientos y conectar la navegación.
- [ ] Añadir filtros por día, semana, mes, año o intervalo de fechas.
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
- [ ] Revisar la accesibilidad, especialmente los indicadores de foco eliminados por el CSS.
- [ ] Resolver las opciones provisionales de Configuración, Ayuda y Salir, y los datos de usuario de ejemplo según el alcance acordado.
- [ ] Verificar el flujo completo de guardar, recargar, filtrar, editar y eliminar, incluyendo errores de conexión y revisión en móvil.

## Ideas opcionales, sin prioridad comprometida

- [ ] Modo oscuro.
- [ ] Integración bancaria con Enable Banking, tras estabilizar el registro manual y definir el alcance.
- [ ] Buscaminas como extra independiente.
- [ ] Autenticación y sesiones si el usuario confirma que las necesita según el despliegue o el uso de la aplicación.

## Apuntes de aprendizaje

Los comentarios didácticos de JavaScript y PHP se han resumido, junto con los apuntes SQL, en [Apuntes_Git_Money.pdf](output/pdf/Apuntes_Git_Money.pdf). Se mantienen comentarios sobre el propósito de los bloques y las decisiones del proyecto. Esta limpieza no resuelve ni marca como completadas las tareas funcionales.
