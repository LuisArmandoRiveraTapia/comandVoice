document.addEventListener('DOMContentLoaded', function () {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES';
    recognition.continuous = true; // Siempre activo
    recognition.interimResults = false; // Solo resultados finales

    let listeningForCommand = false; // Estado para controlar cuándo estamos esperando un comando después de "Navi"

    recognition.onresult = function (event) {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();

        if (transcript.includes("navi")) {
            listeningForCommand = true; // Comienza a escuchar para un comando después de "Navi"
            document.getElementById('result').innerHTML = `<p>Esperando comando...</p>`;
        } else if (listeningForCommand) {
            listeningForCommand = false; // Resetear el estado de escucha
            document.getElementById('result').innerHTML = `<p>Orden identificada: <strong>${transcript}</strong></p>`;
            handleCommand(transcript); // Ejecutar el comando directamente
        }
    };

    recognition.onend = function () {
        if (listeningForCommand) {
            // Si se detiene durante un comando, reinicia la escucha.
            recognition.start();
        }
    };

    recognition.onerror = function (event) {
        document.getElementById('result').innerHTML = '<p>Error en el reconocimiento de voz. Intenta nuevamente.</p>';
    };

    function handleCommand(command) {
        const comandosValidos = [
            'abrir pestaña en blanco',
            'abrir plataforma de estudio',
            'navegar a inteligencia artificial',
            'recargar página actual',
            'abrir una nueva ventana',
            'cerrar ventana',
            'buscar en google'
        ];

        const comandoValidoEncontrado = comandosValidos.some(comandoValido => command.includes(comandoValido));

        if (comandoValidoEncontrado) {
            enviarAccionAMockAPI(command, () => {
                executeCommand(command);
            });
        } else {
            document.getElementById('result').innerHTML = '<p>Comando no reconocido. Intente con uno de la lista.</p>';
        }
    }

    function executeCommand(command) {
        // Ejecuta la acción correspondiente al comando
        if (command.includes('abrir pestaña en blanco')) {
            window.open('https://www.google.com', '_blank');
        } else if (command.includes('abrir plataforma de estudio')) {
            window.open('https://online.kadasofsolutions.com/login/index.php', '_blank');
        } else if (command.includes('navegar a inteligencia artificial')) {
            window.location.href = 'https://www.openai.com';
        } else if (command.includes('recargar página actual')) {
            window.location.reload();
        } else if (command.includes('abrir una nueva ventana')) {
            window.open('https://www.google.com', 'newwindow', 'width=800,height=600');
        } else if (command.includes('cerrar ventana')) {
            window.close();
        } else if (command.startsWith('buscar en google')) {
            const consulta = command.replace('buscar en google', '').trim();
            const urlConsulta = `https://www.google.com/search?q=${encodeURIComponent(consulta)}`;
            window.open(urlConsulta, '_blank');
        }
    }

    function enviarAccionAMockAPI(command, callback) {
        fetch('https://6610df7b0640280f219d87be.mockapi.io/commands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command }) // Envía solo el comando
        })
        .then(response => response.json())
        .then(data => {
            console.log('Orden almacenada con éxito:', data);
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch((error) => {
            console.error('Error al almacenar la orden:', error);
            if (typeof callback === "function") {
                callback();
            }
        });
    }

    recognition.start(); // Inicia el reconocimiento de voz al cargar la página
});
