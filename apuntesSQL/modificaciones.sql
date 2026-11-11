ALTER TABLE movimiento
ADD COLUMN IDUsuario INTEGER;

SELECT movimiento.id,
	   movimiento.idcuenta,
	   cuenta.idusuario
FROM movimiento
JOIN cuenta ON movimiento.idcuenta = cuenta.id;

UPDATE movimiento
SET IDUsuario = 1
WHERE id = 1;

SELECT id, IDCuenta, IDUsuario FROM movimiento;

ALTER TABLE movimiento
ALTER COLUMN IDUsuario SET NOT NULL;

ALTER TABLE cuenta
ADD CONSTRAINT cuenta_id_usuario_unique
UNIQUE (id, IDUsuario);

ALTER TABLE categoria
ADD COLUMN tipo VARCHAR(7)
UNIQUE (id, IDUsuario);

ALTER TABLE movimiento
ADD CONSTRAINT movimiento_cuenta_usuario_fk
FOREIGN KEY (IDCuenta, IDUsuario)
REFERENCES cuenta (id, IDUsuario);

ALTER TABLE movimiento
ADD CONSTRAINT movimiento_categoria_usuario_fk
FOREIGN KEY (IDCategoria, IDUsuario)
REFERENCES categoria (id, IDUsuario);

UPDATE categoria
SET tipo = ''



TRUNCATE TABLE movimiento, cuenta, categoria, usuario
RESTART IDENTITY;



BEGIN;

INSERT INTO usuario (nombre, apellidos, correoElectronico, hashContrasenia)
VALUES ('Pedro', 'Pérez', 'pedro@example.test', 'solo_datos_de_prueba');

INSERT INTO cuenta (tipo, saldoInicial, nombre, IDUsuario)
VALUES ('efectivo', 0.00, 'Cartera', 1);

INSERT INTO categoria (nombre, tipo, IDUsuario)
VALUES
    ('Salario',      'ingreso', 1),
    ('Ventas',       'ingreso', 1),
    ('Regalos',      'ingreso', 1),
    ('Alimentación', 'gasto',   1),
    ('Transporte',   'gasto',   1),
    ('Ocio',         'gasto',   1);

INSERT INTO movimiento
    (concepto, importe, fecha, hora, nota, procedencia, medioPago,
     tipo, IDCuenta, IDCategoria, IDUsuario)
VALUES
    ('Nómina',         950.00, CURRENT_DATE, '09:00', NULL,
     'Empresa de prueba', NULL, 'ingreso', 1, 1, 1),

    ('Venta de juego',  25.00, CURRENT_DATE, '11:30', 'Segunda mano',
     'Wallapop', NULL, 'ingreso', 1, 2, 1),

    ('Supermercado',    32.45, CURRENT_DATE, '13:15', NULL,
     NULL, 'tarjeta', 'gasto', 1, 4, 1),

    ('Guagua',           1.40, CURRENT_DATE, '16:20', NULL,
     NULL, 'efectivo', 'gasto', 1, 5, 1);

COMMIT;