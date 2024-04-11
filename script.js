document.addEventListener('DOMContentLoaded', function () {
    // Removido el acceso al botón y su evento, ya no es necesario

    // Función para iniciar el reconocimiento de voz
    function startRecognition() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES';
        recognition.continuous = true; // Configura el reconocimiento continuo
        recognition.interimResults = false; // No nos interesan los resultados intermedios

        recognition.onresult = function (event) {
            const last = event.results.length - 1; // Obtiene el índice del último resultado
            const transcript = event.results[last][0].transcript.toLowerCase().trim();

            document.getElementById('result').innerHTML = `<p>Orden identificada: <strong>${transcript}</strong></p>`;

            // Ejecuta la acción correspondiente y envía la orden a MockAPI
            handleCommand(transcript);
        };

        recognition.onerror = function (event) {
            document.getElementById('result').innerHTML = '<p>Error en el reconocimiento de voz. Intenta nuevamente.</p>';
        };

        recognition.onend = function () {
            // Reinicia automáticamente el reconocimiento cuando termina
            recognition.start();
        };

        recognition.start();
    }

    startRecognition(); // Inicia el reconocimiento de voz al cargar la página

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
                if (command.includes('abrir pestaña en blanco')) {
                    window.open('https://www.google.com', '_blank');
                } else if (command.includes('abrir plataforma de estudio')) {
                    window.open('https://online.kadasofsolutions.com/login/index.php', '_blank');
                } else if (command.includes('navegar a inteligencia artificial')) {
                    window.location.href = 'https://www.openai.com';
                } else if (command.includes('recargar página actual')) {
                    setTimeout(() => window.location.reload(), 100); // Retraso mínimo
                } else if (command.includes('abrir una nueva ventana')) {
                    window.open('https://www.google.com', 'newwindow', 'width=800,height=600'); 
                } else if (command.includes('cerrar ventana')) {
                    setTimeout(() => window.close(), 100); // Retraso mínimo
                } else if (command.startsWith('buscar en google')) {
                    const consulta = command.replace('buscar en google', '').trim();
                    const urlConsulta = `https://www.google.com/search?q=${encodeURIComponent(consulta)}`;
                    window.open(urlConsulta, '_blank');
                }
            });
        } else {
            document.getElementById('result').innerHTML = '<p>Comando no reconocido. Intente con uno de la lista.</p>';
        }
    }

    function enviarAccionAMockAPI(command, callback) {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        const url = 'https://6610df7b0640280f219d87be.mockapi.io/commands';
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command, timestamp: timestamp }),
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
});
