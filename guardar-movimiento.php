<?php
header("Content-Type: application/json; charset=utf-8");
// muestra el tipo de petición es decir GET o POSt 
// dependiendo de si solo recibe o también envía, respectivamente
// GET Consulta información sin modificarla
// POST envía datos para que el server los procese
$metodo = $_SERVER["REQUEST_METHOD"]; 

if ($metodo !== "POST"){
    // http_response_code es para controlar las peticiones
    // 405 significa "método no permitido"
    http_response_code(405); 
    $mensaje = ["mensaje" => "solo admite peticiones 'POST'"];
    echo json_encode($mensaje);
    exit; //exit hace que el php se deje de ejecutar
}
// file_get_contents se usa para leer lo que mandamos desde el js
// admite un parámetro, php://input es una dirección especial de php
// sirve para leer el cuerpo de la petición que acaba de recibit
$cuerpo = file_get_contents("php://input");
// json_decode transforma el json a un array asociativo
// el primer parámetro es lo que va a leer
// el segundo (true) nos permite trabajar con las claves de este
$datos = json_decode($cuerpo, true);

// json_last error() permite consultar el error de la última operación
// si no hay error devuelve JSON_ERROR_NONE
if (json_last_error() !== JSON_ERROR_NONE){
    http_response_code(400); // 400 indica petición incorrecta
    $mensaje = ["mensaje" => "El cuerpo no contiene JSON válido"];
    echo json_encode($mensaje);
    exit;
}

$respuesta = [
    "metodo" => $_SERVER["REQUEST_METHOD"],
    "conceptoRecibido" => $datos["concepto"],
    "importeRecibido" => $datos["importe"]
];

echo json_encode($respuesta);
