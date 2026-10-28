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
