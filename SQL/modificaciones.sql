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

INSERT INTO categoria(nombre, IDUsuario, tipo)
VALUES ('Nómina', 1, 'ingreso')