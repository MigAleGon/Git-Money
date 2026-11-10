-- NO EJECUTAR ESTE CÓDIGO --

/*
SELECT permite consultar información
version() devuelve la versión del PostgreSQL
*/
SELECT version();

-- crea la bbdd
CREATE DATABASE git_money;

/*
crea una tabla
id y todo lo que viene a la derecha genera un id autoincremental
varchar es q es un string de 100 caracteres y que no puede ser nulo
numeric es un número de 12 cifras y dos de ellos decimales
*/
CREATE TABLE movimientos (
	id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	concepto VARCHAR(100) NOT NULL,
	importe NUMERIC (12, 2)
);

-- ALTER TABLE PERMITE MODIFICAR
-- CAMPOS DE LA TABLA

ALTER TABLE movimientos
ALTER COLUMN importe SET NOT NULL;

-- así se añaden valores al atributo
INSERT INTO usuario (nombre,
	correoElectronico,
	hashContrasenia,
	apellidos)
VALUES ('Miguel',
	'percha@gmail.com',
	'aaa', 'Aleman');

-- Para ver la tabla
SELECT * FROM USUARIO
