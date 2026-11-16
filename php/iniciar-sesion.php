<?php

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"];

if ($metodo !== "POST"){
    http_response_code(405);
    $mensaje = ["mensaje" => "solo admite peticiones 'POST'"];
    echo json_encode($mensaje);
    exit;
}

$cuerpo = file_get_contents("php://input");

$datos = json_decode($cuerpo, true);

if(!is_array($datos) || !isset($datos["correo"], $datos["contrasenia"]) || !is_string($datos["correo"]) || !is_string($datos["contrasenia"])){
    http_response_code(400);
    $mensaje  = ["mensaje" => "Datos no válidos"];
    echo json_encode($mensaje);
    exit;
}

try{
    require_once __DIR__ . "/conexion.php";

    $sql = "SELECT id, hashcontrasenia FROM usuario
            WHERE correoelectronico = :correo";
   
    $consulta = $conexion->prepare($sql);

    $consulta->execute(["correo" => $datos["correo"]]);
    
    $usuarioEncontrado = $consulta->fetch(PDO::FETCH_ASSOC);

    // password_verify compara la contraseña recibida con la contraseña de la bd, devuelve true si coinciden y false si no
    if($usuarioEncontrado === false || !password_verify($datos["contrasenia"], $usuarioEncontrado["hashcontrasenia"])){
        http_response_code(401);
        $respuesta = [
            "correcto" => false,
            "mensaje" => "Correo o contraseña incorrectos"
        ];
        echo json_encode($respuesta);
        exit;
    }

    session_start(); // inicia o recupera la sesión
    session_regenerate_id(); // Renueva el id de sesión
    $_SESSION["idusuario"] = (int) $usuarioEncontrado["id"]; // guardo el id del user en la sesión

    $respuesta = [
        "correcto" => true,
        "mensaje" => "Inicio de sesión correcto"
    ];

} catch (Throwable $error){
    // Registra el detalle en el servidor y devuelve un mensaje genérico al cliente.
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido iniciar sesión"
    ];
}

echo json_encode($respuesta);