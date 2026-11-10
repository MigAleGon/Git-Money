INSERT INTO usuario (nombre, correoElectronico, hashContrasenia, apellidos)
VALUES ('Pedro', 'pedo@gmail.com', '123456', 'Suarez');

INSERT INTO categoria (nombre, tipo, IDUsuario)
VALUES ('Alimentacion', 'gasto', 1);
INSERT INTO categoria (nombre, tipo, IDUsuario)
VALUES ('Ocio', 'gasto', 1);
INSERT INTO categoria (nombre, tipo, IDUsuario)
VALUES ('Nómina', 'ingreso', 1);
INSERT INTO categoria (nombre, tipo, IDUsuario)
VALUES ('Bizum', 'ingreso', 1);

INSERT INTO movimiento (tipo, fecha, importe, concepto, hora, medioPago, IDCuenta, IDCategoria, IDUsuario)
VALUES ('gasto', '2010-10-10', 3.75, 'Tabaco','10:10', 'Efectivo', 1, 4, 1);

INSERT INTO movimiento (tipo, fecha, importe, concepto, hora, medioPago, IDCuenta, IDCategoria, IDUsuario)
VALUES ('gasto', '2010-10-10', 3.75, 'Tabaco','10:10', 'Efectivo', 1, 1, 1);

ALTER ROLE postgres WITH PASSWORD 'percha';

SELECT * FROM usuario;
SELECT * FROM cuenta;
SELECT * FROM categoria;
SELECT * FROM movimiento;

SELECT id, nombre, tipo FROM categoria;
SELECT id, nombre, idusuario FROM cuenta;
SELECT id, nombre FROM usuario;

INSERT INTO cuenta (tipo, saldoInicial, nombre, IDUsuario)
VALUES('efectivo', 0, 'catera', 1)

TRUNCATE TABLE movimiento, categoria, cuenta, usuario
RESTART IDENTITY;


UPDATE cuenta
SET nombre = 'cartera'
WHERE id = 1
