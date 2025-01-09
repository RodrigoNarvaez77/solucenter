const express = require('express');
const sendgrid = require('@sendgrid/mail');
const path = require('path');
const router = express.Router();

// Configura la API Key de SendGrid utilizando una variable de entorno
if (!process.env.SENDGRID_API_KEY) {
    console.error('Error: SENDGRID_API_KEY no está configurada en el archivo .env');
    process.exit(1); // Finaliza el proceso si la clave API no está configurada
}
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Ruta para la página de inicio (donde está tu formulario)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html')); // Cambiado para una mejor estructura del proyecto
});

// Ruta para procesar el formulario
router.post('/submit-form', (req, res) => {
    const { nombre, email, telefono, mensaje } = req.body; // Recibimos los datos del formulario

    // Validación de los datos del formulario
    if (!nombre || !email || !telefono || !mensaje) {
        return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios.' });
    }

    console.log('Formulario recibido:', { nombre, email, telefono, mensaje });

    // Configura el contenido del correo
    const msg = {
        to: 'rodrigo.narvaez@solucenter.cl', // Dirección de correo destino
        from: 'landingpagesolucenter@gmail.com', // Dirección de tu correo registrado en SendGrid
        subject: 'Nuevo mensaje de formulario',
        text: `Nombre: ${nombre}\nCorreo Electrónico: ${email}\nTeléfono: ${telefono}\nMensaje: ${mensaje}`,
    };

    // Enviar correo utilizando SendGrid
    sendgrid
        .send(msg)
        .then(() => {
            console.log('Correo enviado con éxito');
            // Respuesta JSON con success: true
            res.status(200).json({ success: true, message: 'Formulario enviado con éxito!' });
        })
        .catch(error => {
            console.error('Error al enviar el correo:', error.response?.body?.errors || error.message);
            // Respuesta JSON con success: false en caso de error
            res.status(500).json({
                success: false,
                error: 'Error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.',
            });
        });
});
module.exports = router; // Exporta el router