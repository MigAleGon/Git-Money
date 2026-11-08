CREATE TABLE usuario (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(70) NOT NULL,
	correoElectronico VARCHAR(100) UNIQUE NOT NULL,
	hashContrasenia VARCHAR(100) NOT NULL,
	apellidos VARCHAR(70) NOT NULL
);

CREATE TABLE cuenta (
	id SERIAL PRIMARY KEY,
	tipo VARCHAR(50) NOT NULL,
	saldoInicial DECIMAL(12, 2) NOT NULL CHECK(saldoInicial >= 0),
	nombre VARCHAR(70) NOT NULL,
	IDUsuario INTEGER NOT NULL REFERENCES usuario(id),
	UNIQUE (id, IDUsuario)
);

CREATE TABLE categoria (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL,
	IDUsuario INTEGER NOT NULL REFERENCES usuario(id),
	UNIQUE (id, IDUsuario)
);

CREATE TABLE movimiento (
	id SERIAL PRIMARY KEY,
	tipo VARCHAR(7) NOT NULL,
	fecha DATE NOT NULL,
	hora TIME NOT NULL,
	importe DECIMAL(12, 2) NOT NULL CHECK(importe > 0),
	concepto VARCHAR(200) NOT NULL,
	nota VARCHAR(500),
	procedencia VARCHAR(50),
	medioPago VARCHAR(100),
	IDCuenta INTEGER NOT NULL REFERENCES cuenta(id),
	IDCategoria INTEGER NOT NULL REFERENCES categoria(id),
	IDUsuario INTEGER NOT NULL,

	CHECK((tipo = 'ingreso' AND 
		   procedencia IS NOT NULL AND
		   medioPago IS NULL)
		   OR
		  (tipo = 'gasto' AND 
		   medioPago IS NOT NULL AND 
		   procedencia IS NULL)),
	FOREIGN KEY (IDCuenta, IDUsuario)
	REFERENCES cuenta (id, IDUsuario),
	FOREIGN KEY (IDCategoria, IDUsuario)
	REFERENCES categoria (id, IDUsuario)
);



