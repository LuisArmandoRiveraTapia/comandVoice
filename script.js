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
            try {
                window.close();
            } catch (e) {
                console.log("No se pudo cerrar la ventana: ", e);
                alert("Esta ventana no se puede cerrar mediante comandos de voz debido a restricciones del navegador.");
            }
        }
        
        // Enviar el comando a MockAPI
        enviarAccionAMockAPI(command);
    }

    function enviarAccionAMockAPI(command) {
        const url = 'https://6610df7b0640280f219d87be.mockapi.io/commands'; // Reemplaza con tu URL real de MockAPI
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command, timestamp: new Date().toISOString() }),
        })
        .then(response => response.json())
        .then(data => console.log('Orden almacenada con éxito:', data))
        .catch((error) => console.error('Error al almacenar la orden:', error));
    }
});
