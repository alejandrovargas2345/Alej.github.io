async function consultarGeminiAI(pregunta) {
    const apiKey = "AIzaSyBUXc8p9Okhl6uva548Uz-fE1JUVTr13a4"; // Reemplaza con tu API Key

    const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: pregunta }] }]
        })
    });

    const datos = await respuesta.json();
    const textoRespuesta = datos.candidates?.[0]?.content?.parts?.[0]?.text || "No se encontró respuesta.";

    agregarMensaje("bot", textoRespuesta, true);
}

// Función para agregar mensajes con animación de escritura
function agregarMensaje(tipo, texto, animado = false) {
    const chatBody = document.querySelector(".chat-body");
    const mensajeDiv = document.createElement("div");
    mensajeDiv.classList.add("message", tipo);

    // Agregar animación de entrada
    mensajeDiv.style.opacity = "0";
    mensajeDiv.style.transform = "translateY(10px)";
    
    // Crear un contenedor interno para la animación
    const contenidoDiv = document.createElement("div");
    mensajeDiv.appendChild(contenidoDiv);
    chatBody.appendChild(mensajeDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Animación de aparición
    setTimeout(() => {
        mensajeDiv.style.opacity = "1";
        mensajeDiv.style.transform = "translateY(0)";
    }, 100);

    if (animado) {
        escribirTexto(contenidoDiv, texto);
    } else {
        contenidoDiv.innerHTML = `<p>${texto}</p>`;
    }
}

// Función para la animación de escritura tipo máquina de escribir
function escribirTexto(elemento, texto) {
    let i = 0;
    function escribir() {
        if (i < texto.length) {
            elemento.innerHTML += texto[i] === "\n" ? "<br>" : texto[i];
            i++;
            setTimeout(escribir, 5); // Velocidad de escritura
        }
    }
    escribir();
}

// Evento del botón de enviar
document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("user-input");
    const pregunta = input.value.trim();

    if (pregunta) {
        agregarMensaje("user", pregunta);
        consultarGeminiAI(pregunta);
        input.value = "";
    }
});

// Evento para enviar con Enter
document.getElementById("user-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        document.getElementById("send-btn").click();
    }
});


