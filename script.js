document.addEventListener('DOMContentLoaded', function () {
    const voiceBtn = document.getElementById('voiceBtn');
    const resultDiv = document.getElementById('result');

    voiceBtn.addEventListener('click', function () {
        recognizeSpeech();
    });

    function recognizeSpeech() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'es-ES';

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript.toLowerCase();

            resultDiv.innerHTML = `<p>Orden identificada: <strong>${transcript}</strong></p>`;

            // Ejecuta la acción correspondiente y envía la orden a MockAPI
            handleCommand(transcript);
        };

        recognition.onerror = function (event) {
            resultDiv.innerHTML = '<p>Error en el reconocimiento de voz. Intenta nuevamente.</p>';
        };

        recognition.start();
    }

    function handleCommand(command) {
        // Define los comandos válidos
        const comandosValidos = [
            'abrir pestaña en blanco',
            'abrir plataforma de estudio',
            'navegar a inteligencia artificial',
            'recargar página actual',
            'abrir una nueva ventana',
            'cerrar ventana',
            'buscar en google'
        ];

        // Verifica si el comando es válido antes de intentar ejecutarlo
        const comandoValidoEncontrado = comandosValidos.some(comandoValido => command.includes(comandoValido));

        if (comandoValidoEncontrado) {
            // Enviar el comando a MockAPI antes de ejecutar acciones
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
            resultDiv.innerHTML = '<p>Comando no reconocido. Intente con uno de la lista.</p>';
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
