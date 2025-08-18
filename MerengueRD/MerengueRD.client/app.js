const API_BASE = 'http://localhost:5167/api';

// Global state
let currentEditingId = null;
let allQuestions = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadArtists();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
            
            // Load data for the selected tab
            loadTabData(targetTab);
        });
    });
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'artists':
            loadArtists();
            break;
        case 'songs':
            loadSongs();
            break;
        case 'events':
            loadEvents();
            break;
        case 'questionquizzes':
            loadQuestions();
            break;
        case 'quizmusicals':
            loadQuizzes();
            break;
    }
}

// Utility Functions
function showMessage(message, type = 'success') {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messagesDiv.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES');
}

// API Functions
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        showMessage(`Error en la API: ${error.message}`, 'error');
        throw error;
    }
}

// Artists Management
async function loadArtists() {
    try {
        const artists = await apiRequest('/artists');
        displayArtists(artists);
    } catch (error) {
        document.getElementById('artistsTableBody').innerHTML = 
            '<tr><td colspan="5">Error al cargar artistas</td></tr>';
    }
}

function displayArtists(artists) {
    const tbody = document.getElementById('artistsTableBody');
    tbody.innerHTML = '';

    if (!artists || artists.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay artistas registrados</td></tr>';
        return;
    }

    artists.forEach(artist => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${artist.id}</td>
            <td>${artist.nombre}</td>
            <td>${formatDate(artist.fechaNacimiento)}</td>
            <td>${artist.nacionalidad || 'N/A'}</td>
            <td class="action-buttons">
                <button class="btn btn-warning" onclick="editArtist(${artist.id})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteArtist(${artist.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editArtist(id) {
    try {
        const artist = await apiRequest(`/artists/${id}`);
        fillArtistForm(artist);
        currentEditingId = id;
    } catch (error) {
        showMessage('Error al cargar artista para editar', 'error');
    }
}

function fillArtistForm(artist) {
    document.getElementById('artistId').value = artist.id;
    document.getElementById('artistNombre').value = artist.nombre || '';
    document.getElementById('artistFechaNacimiento').value = artist.fechaNacimiento ? artist.fechaNacimiento.split('T')[0] : '';
    document.getElementById('artistNacionalidad').value = artist.nacionalidad || '';
    document.getElementById('artistBiografia').value = artist.biografia || '';
    document.getElementById('artistFotoUrl').value = artist.fotoUrl || '';
}

async function deleteArtist(id) {
    if (confirm('¿Está seguro de eliminar este artista?')) {
        try {
            await apiRequest(`/artists/${id}`, { method: 'DELETE' });
            showMessage('Artista eliminado correctamente');
            loadArtists();
        } catch (error) {
            showMessage('Error al eliminar artista', 'error');
        }
    }
}

function clearArtistForm() {
    document.getElementById('artistForm').reset();
    document.getElementById('artistId').value = '';
    currentEditingId = null;
}

// Artist Form Handler
document.getElementById('artistForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const artistData = {
        nombre: formData.get('nombre'),
        fechaNacimiento: formData.get('fechaNacimiento') || null,
        nacionalidad: formData.get('nacionalidad') || null,
        biografia: formData.get('biografia') || null,
        fotoUrl: formData.get('fotoUrl') || null
    };

    const id = formData.get('id');
    
    try {
        if (id) {
            artistData.id = parseInt(id);
            await apiRequest(`/artists/${id}`, {
                method: 'PUT',
                body: JSON.stringify(artistData)
            });
            showMessage('Artista actualizado correctamente');
        } else {
            await apiRequest('/artists', {
                method: 'POST',
                body: JSON.stringify(artistData)
            });
            showMessage('Artista creado correctamente');
        }
        
        clearArtistForm();
        loadArtists();
    } catch (error) {
        showMessage('Error al guardar artista', 'error');
    }
});

// Songs Management
async function loadSongs() {
    try {
        const songs = await apiRequest('/songs');
        displaySongs(songs);
    } catch (error) {
        document.getElementById('songsTableBody').innerHTML = 
            '<tr><td colspan="5">Error al cargar canciones</td></tr>';
    }
}

function displaySongs(songs) {
    const tbody = document.getElementById('songsTableBody');
    tbody.innerHTML = '';

    if (!songs || songs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay canciones registradas</td></tr>';
        return;
    }

    songs.forEach(song => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${song.id}</td>
            <td>${song.titulo}</td>
            <td>${song.duracion || 'N/A'}</td>
            <td>${formatDate(song.fechaLanzamiento)}</td>
            <td class="action-buttons">
                <button class="btn btn-warning" onclick="editSong(${song.id})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteSong(${song.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editSong(id) {
    try {
        const song = await apiRequest(`/songs/${id}`);
        fillSongForm(song);
        currentEditingId = id;
    } catch (error) {
        showMessage('Error al cargar canción para editar', 'error');
    }
}

function fillSongForm(song) {
    document.getElementById('songId').value = song.id;
    document.getElementById('songTitulo').value = song.titulo || '';
    document.getElementById('songDuracion').value = song.duracion || '';
    document.getElementById('songFechaLanzamiento').value = song.fechaLanzamiento ? song.fechaLanzamiento.split('T')[0] : '';
    document.getElementById('songDescription').value = song.description || '';
    document.getElementById('songAudioUrl').value = song.audioUrl || '';
}

async function deleteSong(id) {
    if (confirm('¿Está seguro de eliminar esta canción?')) {
        try {
            await apiRequest(`/songs/${id}`, { method: 'DELETE' });
            showMessage('Canción eliminada correctamente');
            loadSongs();
        } catch (error) {
            showMessage('Error al eliminar canción', 'error');
        }
    }
}

function clearSongForm() {
    document.getElementById('songForm').reset();
    document.getElementById('songId').value = '';
    currentEditingId = null;
}

// Song Form Handler
document.getElementById('songForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const songData = {
        titulo: formData.get('titulo'),
        duracion: formData.get('duracion') || null,
        fechaLanzamiento: formData.get('fechaLanzamiento') || null,
        description: formData.get('description') || null,
        audioUrl: formData.get('audioUrl') || null
    };

    const id = formData.get('id');
    
    try {
        if (id) {
            songData.id = parseInt(id);
            await apiRequest(`/songs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(songData)
            });
            showMessage('Canción actualizada correctamente');
        } else {
            await apiRequest('/songs', {
                method: 'POST',
                body: JSON.stringify(songData)
            });
            showMessage('Canción creada correctamente');
        }
        
        clearSongForm();
        loadSongs();
    } catch (error) {
        showMessage('Error al guardar canción', 'error');
    }
});

// Events Management
async function loadEvents() {
    try {
        const events = await apiRequest('/eventchronologicals');
        displayEvents(events);
    } catch (error) {
        document.getElementById('eventsTableBody').innerHTML = 
            '<tr><td colspan="5">Error al cargar eventos</td></tr>';
    }
}

function displayEvents(events) {
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = '';

    if (!events || events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay eventos registrados</td></tr>';
        return;
    }

    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.id}</td>
            <td>${event.titulo}</td>
            <td>${formatDate(event.fechainicio)}</td>
            <td>${event.description ? event.description.substring(0, 50) + '...' : 'N/A'}</td>
            <td class="action-buttons">
                <button class="btn btn-warning" onclick="editEvent(${event.id})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteEvent(${event.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editEvent(id) {
    try {
        const event = await apiRequest(`/eventchronologicals/${id}`);
        fillEventForm(event);
        currentEditingId = id;
    } catch (error) {
        showMessage('Error al cargar evento para editar', 'error');
    }
}

function fillEventForm(event) {
    document.getElementById('eventId').value = event.id;
    document.getElementById('eventTitulo').value = event.titulo || '';
    document.getElementById('eventFechainicio').value = event.fechainicio ? event.fechainicio.split('T')[0] : '';
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventImagenUrl').value = event.imagenUrl || '';
}

async function deleteEvent(id) {
    if (confirm('¿Está seguro de eliminar este evento?')) {
        try {
            await apiRequest(`/eventchronologicals/${id}`, { method: 'DELETE' });
            showMessage('Evento eliminado correctamente');
            loadEvents();
        } catch (error) {
            showMessage('Error al eliminar evento', 'error');
        }
    }
}

function clearEventForm() {
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    currentEditingId = null;
}

// Event Form Handler
document.getElementById('eventForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const eventData = {
        titulo: formData.get('titulo'),
        fechainicio: formData.get('fechainicio') || null,
        description: formData.get('description') || null,
        imagenUrl: formData.get('imagenUrl') || null
    };

    const id = formData.get('id');
    
    try {
        if (id) {
            eventData.id = parseInt(id);
            await apiRequest(`/eventchronologicals/${id}`, {
                method: 'PUT',
                body: JSON.stringify(eventData)
            });
            showMessage('Evento actualizado correctamente');
        } else {
            await apiRequest('/eventchronologicals', {
                method: 'POST',
                body: JSON.stringify(eventData)
            });
            showMessage('Evento creado correctamente');
        }
        
        clearEventForm();
        loadEvents();
    } catch (error) {
        showMessage('Error al guardar evento', 'error');
    }
});

// Questions Management
async function loadQuestions() {
    try {
        const questions = await apiRequest('/questionquizzes');
        allQuestions = questions; // Store for quiz management
        displayQuestions(questions);
    } catch (error) {
        document.getElementById('questionsTableBody').innerHTML = 
            '<tr><td colspan="5">Error al cargar preguntas</td></tr>';
    }
}

function displayQuestions(questions) {
    const tbody = document.getElementById('questionsTableBody');
    tbody.innerHTML = '';

    if (!questions || questions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay preguntas registradas</td></tr>';
        return;
    }

    questions.forEach(question => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${question.id}</td>
            <td>${question.enunciado ? question.enunciado.substring(0, 50) + '...' : 'N/A'}</td>
            <td>${question.tipo}</td>
            <td>${question.respuestaCorrecta}</td>
            <td class="action-buttons">
                <button class="btn btn-warning" onclick="editQuestion(${question.id})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteQuestion(${question.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editQuestion(id) {
    try {
        const question = await apiRequest(`/questionquizzes/${id}`);
        fillQuestionForm(question);
        currentEditingId = id;
    } catch (error) {
        showMessage('Error al cargar pregunta para editar', 'error');
    }
}

function fillQuestionForm(question) {
    document.getElementById('questionId').value = question.id;
    document.getElementById('questionEnunciado').value = question.enunciado || '';
    document.getElementById('questionTipo').value = question.tipo || '';
    document.getElementById('questionOpciones').value = question.opciones || '';
    document.getElementById('questionRespuestaCorrecta').value = question.respuestaCorrecta || '';
}

async function deleteQuestion(id) {
    if (confirm('¿Está seguro de eliminar esta pregunta?')) {
        try {
            await apiRequest(`/questionquizzes/${id}`, { method: 'DELETE' });
            showMessage('Pregunta eliminada correctamente');
            loadQuestions();
        } catch (error) {
            showMessage('Error al eliminar pregunta', 'error');
        }
    }
}

function clearQuestionForm() {
    document.getElementById('questionForm').reset();
    document.getElementById('questionId').value = '';
    currentEditingId = null;
}

// Question Form Handler
document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const questionData = {
        enunciado: formData.get('enunciado'),
        tipo: formData.get('tipo'),
        opciones: formData.get('opciones') || null,
        respuestaCorrecta: formData.get('respuestaCorrecta')
    };

    const id = formData.get('id');
    
    try {
        if (id) {
            questionData.id = parseInt(id);
            await apiRequest(`/questionquizzes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(questionData)
            });
            showMessage('Pregunta actualizada correctamente');
        } else {
            await apiRequest('/questionquizzes', {
                method: 'POST',
                body: JSON.stringify(questionData)
            });
            showMessage('Pregunta creada correctamente');
        }
        
        clearQuestionForm();
        loadQuestions();
    } catch (error) {
        showMessage('Error al guardar pregunta', 'error');
    }
});

// Quiz Musical Management
async function loadQuizzes() {
    try {
        const quizzes = await apiRequest('/quizmusicals');
        displayQuizzes(quizzes);
    } catch (error) {
        document.getElementById('quizzesTableBody').innerHTML = 
            '<tr><td colspan="6">Error al cargar quizzes</td></tr>';
    }
}

function displayQuizzes(quizzes) {
    const tbody = document.getElementById('quizzesTableBody');
    tbody.innerHTML = '';

    if (!quizzes || quizzes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No hay quizzes registrados</td></tr>';
        return;
    }

    quizzes.forEach(quiz => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quiz.id}</td>
            <td>${quiz.titulo}</td>
            <td>${quiz.duracionMax || 'N/A'} min</td>
            <td>${quiz.nivel}</td>
            <td>${quiz.preguntas ? quiz.preguntas.length : 0}</td>
            <td class="action-buttons">
                <button class="btn btn-warning" onclick="editQuiz(${quiz.id})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="deleteQuiz(${quiz.id})">🗑️ Eliminar</button>
                <button class="btn btn-success" onclick="viewQuizDetails(${quiz.id})">👁️ Ver</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function editQuiz(id) {
    try {
        const quiz = await apiRequest(`/quizmusicals/${id}`);
        fillQuizForm(quiz);
        currentEditingId = id;
    } catch (error) {
        showMessage('Error al cargar quiz para editar', 'error');
    }
}

function fillQuizForm(quiz) {
    document.getElementById('quizId').value = quiz.id;
    document.getElementById('quizTitulo').value = quiz.titulo || '';
    document.getElementById('quizDuracionMax').value = quiz.duracionMax || '';
    document.getElementById('quizNivel').value = quiz.nivel || '';
    
    // Display questions
    displayQuizQuestions(quiz.preguntas || []);
}

function displayQuizQuestions(preguntas) {
    const container = document.getElementById('preguntasContainer');
    container.innerHTML = '';

    if (preguntas.length === 0) {
        container.innerHTML = '<p>No hay preguntas asignadas a este quiz.</p>';
        return;
    }

    preguntas.forEach(pregunta => {
        const div = document.createElement('div');
        div.className = 'pregunta-item';
        div.innerHTML = `
            <h4>ID: ${pregunta.id}</h4>
            <p><strong>Enunciado:</strong> ${pregunta.enunciado}</p>
            <p><strong>Tipo:</strong> ${pregunta.tipo}</p>
            <p><strong>Respuesta:</strong> ${pregunta.respuestaCorrecta}</p>
        `;
        container.appendChild(div);
    });
}

async function deleteQuiz(id) {
    if (confirm('¿Está seguro de eliminar este quiz?')) {
        try {
            await apiRequest(`/quizmusicals/${id}`, { method: 'DELETE' });
            showMessage('Quiz eliminado correctamente');
            loadQuizzes();
        } catch (error) {
            showMessage('Error al eliminar quiz', 'error');
        }
    }
}

async function viewQuizDetails(id) {
    try {
        const quiz = await apiRequest(`/quizmusicals/${id}`);
        let detailsMessage = `Quiz: ${quiz.titulo}\nNivel: ${quiz.nivel}\nDuración: ${quiz.duracionMax} min\nPreguntas: ${quiz.preguntas ? quiz.preguntas.length : 0}`;
        
        if (quiz.preguntas && quiz.preguntas.length > 0) {
            detailsMessage += '\n\nPreguntas:\n';
            quiz.preguntas.forEach((pregunta, index) => {
                detailsMessage += `${index + 1}. ${pregunta.enunciado.substring(0, 50)}...\n`;
            });
        }
        
        alert(detailsMessage);
    } catch (error) {
        showMessage('Error al cargar detalles del quiz', 'error');
    }
}

function clearQuizForm() {
    document.getElementById('quizForm').reset();
    document.getElementById('quizId').value = '';
    document.getElementById('preguntasContainer').innerHTML = '';
    currentEditingId = null;
}

// Quiz Form Handler
document.getElementById('quizForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const quizData = {
        titulo: formData.get('titulo'),
        duracionMax: formData.get('duracionMax') ? parseInt(formData.get('duracionMax')) : null,
        nivel: formData.get('nivel'),
        preguntas: [] // For simplicity, we'll create quizzes without questions initially
    };

    const id = formData.get('id');
    
    try {
        if (id) {
            quizData.id = parseInt(id);
            // If editing, preserve existing questions
            const existingQuiz = await apiRequest(`/quizmusicals/${id}`);
            quizData.preguntas = existingQuiz.preguntas || [];
            
            await apiRequest(`/quizmusicals/${id}`, {
                method: 'PUT',
                body: JSON.stringify(quizData)
            });
            showMessage('Quiz actualizado correctamente');
        } else {
            await apiRequest('/quizmusicals', {
                method: 'POST',
                body: JSON.stringify(quizData)
            });
            showMessage('Quiz creado correctamente');
        }
        
        clearQuizForm();
        loadQuizzes();
    } catch (error) {
        showMessage('Error al guardar quiz', 'error');
    }
});

// Additional utility functions for enhanced functionality
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#f44336';
            isValid = false;
        } else {
            field.style.borderColor = '#4caf50';
        }
    });
    
    return isValid;
}

// Enhanced error handling
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    showMessage('Error inesperado en la aplicación', 'error');
});

// Network status detection
window.addEventListener('online', () => {
    showMessage('Conexión restaurada', 'success');
});

window.addEventListener('offline', () => {
    showMessage('Sin conexión a internet', 'error');
});

// Auto-save functionality (optional - can be enabled for forms)
function setupAutoSave(formId, storageKey) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Load saved data
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) field.value = data[key];
        });
    }
    
    // Save on input
    form.addEventListener('input', () => {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem(storageKey, JSON.stringify(data));
    });
    
    // Clear on submit
    form.addEventListener('submit', () => {
        localStorage.removeItem(storageKey);
    });
}

// Initialize auto-save for all forms (optional)
// setupAutoSave('artistForm', 'artist-draft');
// setupAutoSave('songForm', 'song-draft');
// setupAutoSave('eventForm', 'event-draft');
// setupAutoSave('questionForm', 'question-draft');
// setupAutoSave('quizForm', 'quiz-draft');

// Export/Import functionality (bonus feature)
function exportData(entityType) {
    // This function could be implemented to export data as JSON/CSV
    console.log(`Exporting ${entityType} data...`);
    showMessage(`Función de exportación para ${entityType} no implementada aún`, 'error');
}

function importData(entityType, file) {
    // This function could be implemented to import data from JSON/CSV
    console.log(`Importing ${entityType} data from file:`, file);
    showMessage(`Función de importación para ${entityType} no implementada aún`, 'error');
}