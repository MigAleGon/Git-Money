<?php // Siempre ponerlo antes de iniciar el código
// header indica al html el tipo de contenido que vamos a enviar
// en este caso el contenido es tipo json
header("Content-Type: application/json; charset=utf-8");

try {
    // require_one carga otro archivo php una única vez
    require_once __DIR__ . "/conexion.php";
    $respuesta = [ 
        "correcto" => true,
        "mensaje" => "PHP conectado con Git Money"
    ];
} catch (Throwable $error) {
    // getMessage() obtiene el motivo concreto del fallo
    //  y error_log() lo escribe en la terminal donde
    //  está funcionando el servidor.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [ 
        "correcto" => false,
        "mensaje" => "No se ha podido conectar con la base de datos"
    ];
}
// '$' es la forma de declarar variables en php

// json_encode le da el formato json a la variable que asignemos
echo json_encode($respuesta);
