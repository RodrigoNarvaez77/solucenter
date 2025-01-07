window.addEventListener("load", () => {
  const submitButton = document.getElementById("submit-button");
  if (!submitButton) {
    console.error("Submit Button no encontrado.");
    return;
  }

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Evitar recargar la página
    await enviarFormulario(); // Llamar a la función asíncrona
  });
});

async function enviarFormulario() {
  try {
    // Capturar los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const telefono = document.getElementById("telefono").value;
    const mensaje = document.getElementById("mensaje").value;

    const datos = new FormData();
    datos.append("nombre", nombre);
    datos.append("email", email);
    datos.append("telefono", telefono);
    datos.append("mensaje", mensaje);

    // Mostrar feedback visual en el botón
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    // Enviar los datos al servidor (archivo PHP)
    const response = await fetch("../routes/contacto.php", {
      method: "POST",
      body: datos,
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Leer detalles del error
      console.error("Error en la respuesta:", errorDetails);
      showNotification(
        "Error al enviar el formulario: " + errorDetails,
        "error"
      );
      return;
    }

    const data = await response.text(); // Leer la respuesta del servidor
    if (data.includes("Formulario enviado correctamente")) {
      showNotification("Formulario enviado correctamente", "success");
      document.getElementById("contactForm").reset(); // Limpiar el formulario
    } else {
      showNotification("Error al procesar los datos: " + data, "error");
    }
  } catch (error) {
    console.error("Error:", error.message || error);
    showNotification("Hubo un error en la solicitud.", "error");
  } finally {
    // Restaurar el botón
    const submitButton = document.getElementById("submit-button");
    submitButton.disabled = false;
    submitButton.textContent = "Enviar Cotización";
  }
}

// Función para mostrar notificaciones
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type}`;
  void notification.offsetWidth; // Esto fuerza el repaint
  notification.classList.remove("hidden");
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("hidden");
  }, 3000);
}
