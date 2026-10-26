<?php // Siempre ponerlo antes de iniciar el código
// header indica al html el tipo de contenido que vamos a enviar
// en este caso el contenido es tipo json
header("Content-Type: application/json; charset=utf-8");

// '$' es la forma de declarar variables en php
$respuesta = [ 
    "correcto" => true,
    "mensaje" => "PHP conectado con Git Money"
];
// json_encode le da el formato json a la variable que asignemos
echo json_encode($respuesta);