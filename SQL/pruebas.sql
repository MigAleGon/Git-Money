INSERT INTO usuario (nombre, correoElectronico, hashContrasenia, apellidos)
VALUES ('Pedro', 'pedo@gmail.com', '123456', 'Suarez') RETURNING id;

INSERT INTO categoria (nombre, IDUsuario)
VALUES ('Tabaco', 5);

INSERT INTO movimiento (tipo, fecha, importe, concepto, hora, medioPago, IDCuenta, IDCategoria, IDUsuario)
VALUES ('gasto', '2010-10-10', 3.75, 'Tabaco','10:10', 'Efectivo', 1, 4, 1);

INSERT INTO movimiento (tipo, fecha, importe, concepto, hora, medioPago, IDCuenta, IDCategoria, IDUsuario)
VALUES ('gasto', '2010-10-10', 3.75, 'Tabaco','10:10', 'Efectivo', 1, 1, 1);

ALTER ROLE postgres WITH PASSWORD 'percha';