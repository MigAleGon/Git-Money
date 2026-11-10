<?php

$host = "localhost";
$puerto = "5432";
$baseDatos = "git_money_pruebas";
$usuario = "postgres";

// Conexión a PostgreSQL; la contraseña se recibe del entorno del proceso PHP.
$dsn = "pgsql:host=$host;port=$puerto;dbname=$baseDatos";

$contrasenia = getenv("GIT_MONEY_DB_PASSWORD");

// Detiene la conexión si no se ha configurado la contraseña.
if($contrasenia === false || $contrasenia === ""){
    throw new RuntimeException("Falta configurar la contraseña de PostgreSQL");
}

$conexion = new PDO($dsn, $usuario, $contrasenia);
