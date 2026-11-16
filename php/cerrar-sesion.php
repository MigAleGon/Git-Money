<?php

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo !== "POST"){
    http_response_code(405);
    $mensaje = ["mensaje" => "solo admite peticiones 'POST'"];
    echo json_encode($mensaje);
    exit;
}

try{
    session_start();
    $_SESSION = [];

    //Comprueba en la configuración de PHP si las sesiones se identifican mediante cookies
    if (ini_get("session.use_cookies")) {
        // Recoge las opciones con las que se creó la cookie: por ejemplo, su ruta y dominio
        $parametrosCookie = session_get_cookie_params();

        // setcookie() envía una instrucción al navegador
        setcookie(
            // session_name() obtiene el nombre de la cookie de sesión de PHP
            session_name(),
            // le asigna un valor vacío
            "",
            // time() - 42000 le pone una fecha de caducidad pasada, para que el navegador la elimine
            time() - 42000,
            $parametrosCookie["path"],
            $parametrosCookie["domain"],
            $parametrosCookie["secure"],
            $parametrosCookie["httponly"]
        );
    }

    session_destroy();

    $respuesta = [
        "correcto" => true,
        "mensaje" => "Sesión cerrada"
    ];

} catch (Throwable $error){
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido cerrar la sesión"
    ];
}

echo json_encode($respuesta);