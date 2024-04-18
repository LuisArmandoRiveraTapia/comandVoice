document.addEventListener('DOMContentLoaded', function () {
    let lastCommandId = 0; // Guardará el ID del último comando ejecutado para evitar repeticiones

    function fetchLastCommand() {
        const url = 'https://6610df7b0640280f219d87be.mockapi.io/commands';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const lastCommand = data[data.length - 1]; // Asumimos que el último comando está al final del array
                if (lastCommand && lastCommand.id !== lastCommandId) {
                    lastCommandId = lastCommand.id;
                    executeCommand(lastCommand.command);
                }
            })
            .catch(error => console.error('Error fetching the command:', error));
    }

    function executeCommand(command) {
        document.getElementById('result').innerHTML = `<p>Ejecutando comando: <strong>${command}</strong></p>`;
        if (command === 'abrir pestaña en blanco') {
            window.open('https://www.google.com', '_blank');
        } else if (command === 'abrir plataforma de estudio') {
            window.open('https://online.kadasofsolutions.com/login/index.php', '_blank');
        } else if (command === 'navegar a inteligencia artificial') {
            window.location.href = 'https://www.openai.com';
        } else if (command === 'recargar página actual') {
            setTimeout(() => window.location.reload(), 100);
        } else if (command === 'abrir una nueva ventana') {
            window.open('https://www.google.com', 'newwindow', 'width=800,height=600');
        } else if (command === 'cerrar ventana') {
            setTimeout(() => window.close(), 100);
        } else if (command.startsWith('buscar en google')) {
            const consulta = command.replace('buscar en google', '').trim();
            const urlConsulta = `https://www.google.com/search?q=${encodeURIComponent(consulta)}`;
            window.open(urlConsulta, '_blank');
        } else {
            document.getElementById('result').innerHTML = '<p>Comando no reconocido.</p>';
        }
    }

    setInterval(fetchLastCommand, 2000); // Consulta el último comando cada 2 segundos
});
