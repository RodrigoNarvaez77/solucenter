<?php
require __DIR__ . '/../vendor/autoload.php'; // Cargar las dependencias de Composer

use Dotenv\Dotenv; // Importar la clase Dotenv

// Cargar las variables de entorno desde el archivo .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

use SendGrid\Mail\Mail;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Capturar los datos del formulario
    $nombre = htmlspecialchars($_POST['nombre']);
    $email = htmlspecialchars($_POST['email']);
    $telefono = htmlspecialchars($_POST['telefono']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    // Validar los campos
    if (empty($nombre) || empty($email) || empty($telefono) || empty($mensaje)) {
        http_response_code(400);
        echo "Todos los campos son obligatorios.";
        exit;
    }

    // Crear el correo con SendGrid
    $emailObj = new Mail();
    $emailObj->setFrom($_ENV['SENDGRID_FROM_EMAIL'], $_ENV['SENDGRID_FROM_NAME']);
    $emailObj->setSubject("Nueva solicitud de cotización");
    $emailObj->addTo($_ENV['SENDGRID_TO_EMAIL'], $_ENV['SENDGRID_TO_NAME']);
    $emailObj->addContent(
        "text/plain",
        "Nombre: $nombre\nCorreo: $email\nTeléfono: $telefono\nMensaje: $mensaje"
    );

    $sendgrid = new \SendGrid($_ENV['SENDGRID_API_KEY']);

    try {
        $response = $sendgrid->send($emailObj);

        // Registrar la respuesta de SendGrid
        file_put_contents(__DIR__ . '/sendgrid.log', print_r($response, true), FILE_APPEND);

        if ($response->statusCode() == 202) {
            echo "Formulario enviado correctamente.";
        } else {
            http_response_code(500);
            echo "Hubo un error al enviar el formulario. Código: " . $response->statusCode();
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo "Error al enviar el correo: " . $e->getMessage();
        file_put_contents(__DIR__ . '/sendgrid.log', $e->getMessage(), FILE_APPEND);
    }
} else {
    http_response_code(405);
    echo "Método no permitido.";
}
