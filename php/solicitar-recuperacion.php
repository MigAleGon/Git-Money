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

if(!isset($datos["correo"])){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "Faltan datos"
    ];
    echo json_encode($mensaje);
    exit;
}

if(!is_string($datos["correo"]) || trim($datos["correo"]) === "" || mb_strlen(trim($datos["correo"])) > 100 || !filter_var(trim($datos["correo"]), FILTER_VALIDATE_EMAIL)){
    http_response_code(400);
    $mensaje = [
        "correcto" => false,
        "mensaje" => "El correo no es válido"
    ];
    echo json_encode($mensaje);
    exit;
}

try{
    require_once __DIR__ . "/conexion.php";

    $sqlUsuario = "SELECT id FROM usuario
                   WHERE correoElectronico = :correo";
    $consultaUsuario = $conexion->prepare($sqlUsuario);

    $consultaUsuario->execute(["correo" => trim($datos["correo"])]);

    $idusuario = $consultaUsuario->fetchColumn();

    if($idusuario !== false){
        // bin2hex() convierte de binario a hexadecimal
        // random_bytes() genera x bytes aleatorios
        $token = bin2hex(random_bytes(32));

        // encripta con el algoritmo sha256
        $hashToken = hash("sha256", $token);

        $sqlToken = "INSERT INTO token_recuperacion (IDUsuario, hash_token, expira_en)
                     VALUES (:idusuario, :hash_token, CURRENT_TIMESTAMP + INTERVAL '30 minutes')";
        $consultaToken = $conexion->prepare($sqlToken);

        $consultaToken->execute([
            "idusuario" => $idusuario,
            "hash_token" => $hashToken,
        ]);

        $enlace = "https://git-money.example/restablecer-contrasenia.html?token=$token";
        $asunto = "Recuperación de contraseña";
        $mensajeCorreo = "Enlace: $enlace
            \n\n
            El código caducará en 30 minutos";
        ini_set("SMTP", "127.0.0.1");
        ini_set("smtp_port", "1025");
        ini_set("sendmail_from", "git-money@example.com");
        $enviado = mail(trim($datos["correo"]), $asunto, $mensajeCorreo);
    }

    $respuesta = [
        "correcto" => true,
        "mensaje" => "Si la cuenta existe, recibirás un enlace para restablecer la contraseña"
    ];

} catch (Throwable $error) {
    error_log($error->getMessage());
    http_response_code(500);
    $respuesta = [
        "correcto" => false,
        "mensaje" => "No se ha podido solicitar la recuperación de contraseña"
    ];
}

echo json_encode($respuesta);