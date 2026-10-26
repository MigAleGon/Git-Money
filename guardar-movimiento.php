<?php
header("Content-Type: application/json; charset=utf-8");
// muestra el tipo de petición es decir GET o POSt 
// dependiendo de si solo recibe o también envía, respectivamente
// GET Consulta información sin modificarla
// POST envía datos para que el server los procese
$metodo = ["metodo" => $_SERVER["REQUEST_METHOD"]]; 
echo json_encode($metodo);