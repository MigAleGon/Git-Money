<?php

$host = "localhost";
$puerto = "5432";
$baseDatos = "git_money_pruebas";
$usuario = "postgres";

// para conectar con PDO (herramienta para trabajar con otras bbdd)
//  necesitamos crear un dsn con esta estructura
$dsn = "pgsql:host=$host;port=$puerto;dbname=$baseDatos";


// lee la variable de entorno que indiquemos
// variable de entorno: dato que los programas pueden recibir del entorno donde se ejecutan
// comando creando variable de entorno en terminal:
// $env:GIT_MONEY_DB_PASSWORD = Read-Host "Contraseña de PostgreSQL" -MaskInput

$contrasenia = getenv("GIT_MONEY_DB_PASSWORD");

// si no se ha creado contraseña getenv devuelve false
if($contrasenia === false || $contrasenia === ""){
    throw new RuntimeException("Falta configurar la contraseña de PostgreSQL");
}

// crea un objeto que representa la conexión
$conexion = new PDO($dsn, $usuario, $contrasenia);