const API_BASE_URL = 'http://localhost:5167/api';

// Variables globales
let currentEditingId = null;
let currentEditingEntity = null;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadAllData();
    setupEventListeners();
});

// Configuración de pestañas
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Ocultar todas las pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Ocultar todos los botones activos
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Mostrar la pestaña seleccionada
    document.getElementById(`${tabName}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Cargar datos específicos de la pestaña
    loadTabData(tabName);
}

// Cargar datos al inicializar
function loadAllData() {
    loadArtists();
    loadEvents();
    loadQuestions();
    loadQuizzes();
    loadSongs();
}

function loadTabData(tabName) {
    switch(tabName) {
        case 'artists':
            loadArtists();
            break;
        case 'events':
            loadEvents();
            break;
        case 'questions':
            loadQuestions();
            break;
        case 'quizzes':
            loadQuizzes();
            break;
        case 'songs':
            loadSongs();
            break;
    }
}

// Configurar event listeners para formularios
function setupEventListeners() {
    // Formulario de artistas
    document.getElementById('artist-form').addEventListener('submit', handleArtistSubmit);
    
    // Formulario de eventos
    document.getElementById('event-form').addEventListener('submit', handleEventSubmit);
    
    // Formulario de preguntas
    document.getElementById('question-form').addEventListener('submit', handleQuestionSubmit);
    
    // Formulario de quizzes
    document.getElementById('quiz-form').addEventListener('submit', handleQuizSubmit);
    
    // Formulario de canciones
    document.getElementById('song-form').addEventListener('submit', handleSongSubmit);
}

// Utilidades HTTP
async function makeRequest(url, options = {}) {
    showLoading();
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Si no hay contenido (204 No Content), retornar null
        if (response.status === 204) {
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la petición:', error);
        showNotification('Error: ' + error.message, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Funciones para mostrar/ocultar elementos
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    messageElement.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// ====== ARTISTAS ======
async function loadArtists() {
    try {
        const artists = await makeRequest(`${API_BASE_URL}/artists`);
        renderArtists(artists);
    } catch (error) {
        console.error('Error cargando artistas:', error);
    }
}

function renderArtists(artists) {
    const tbody = document.getElementById('artists-tbody');
    tbody.innerHTML = '';
    
    artists.forEach(artist => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${artist.id}</td>
            <td class="text-truncate">${artist.nombre}</td>
            <td>${formatDate(artist.fechaNacimiento)}</td>
            <td class="text-truncate">${artist.nacionalidad}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editArtist(${artist.id})">Editar</button>
                <button class="btn-danger" onclick="deleteArtist(${artist.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showArtistForm() {
    document.getElementById('artist-form-container').classList.remove('hidden');
    document.getElementById('artist-form-title').textContent = 'Nuevo Artista';
    document.getElementById('artist-form').reset();
    document.getElementById('artist-id').value = '';
    currentEditingId = null;
    currentEditingEntity = 'artist';
}

function hideArtistForm() {
    document.getElementById('artist-form-container').classList.add('hidden');
    currentEditingId = null;
    currentEditingEntity = null;
}

async function handleArtistSubmit(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('artist-nombre').value,
        fechaNacimiento: document.getElementById('artist-fechanacimiento').value,
        nacionalidad: document.getElementById('artist-nacionalidad').value,
        biografia: document.getElementById('artist-biografia').value,
        fotoUrl: document.getElementById('artist-fotourl').value || null
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await makeRequest(`${API_BASE_URL}/artists/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showNotification('Artista actualizado correctamente');
        } else {
            await makeRequest(`${API_BASE_URL}/artists`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showNotification('Artista creado correctamente');
        }
        
        hideArtistForm();
        loadArtists();
    } catch (error) {
        console.error('Error guardando artista:', error);
    }
}

async function editArtist(id) {
    try {
        const artist = await makeRequest(`${API_BASE_URL}/artists/${id}`);
        
        document.getElementById('artist-id').value = artist.id;
        document.getElementById('artist-nombre').value = artist.nombre;
        document.getElementById('artist-fechanacimiento').value = artist.fechaNacimiento.split('T')[0];
        document.getElementById('artist-nacionalidad').value = artist.nacionalidad;
        document.getElementById('artist-biografia').value = artist.biografia;
        document.getElementById('artist-fotourl').value = artist.fotoUrl || '';
        
        document.getElementById('artist-form-title').textContent = 'Editar Artista';
        document.getElementById('artist-form-container').classList.remove('hidden');
        
        currentEditingId = id;
        currentEditingEntity = 'artist';
    } catch (error) {
        console.error('Error cargando artista:', error);
    }
}

async function deleteArtist(id) {
    if (confirm('¿Está seguro de que desea eliminar este artista?')) {
        try {
            await makeRequest(`${API_BASE_URL}/artists/${id}`, {
                method: 'DELETE'
            });
            showNotification('Artista eliminado correctamente');
            loadArtists();
        } catch (error) {
            console.error('Error eliminando artista:', error);
        }
    }
}

// ====== EVENTOS ======
async function loadEvents() {
    try {
        const events = await makeRequest(`${API_BASE_URL}/eventchronologicals`);
        renderEvents(events);
    } catch (error) {
        console.error('Error cargando eventos:', error);
    }
}

function renderEvents(events) {
    const tbody = document.getElementById('events-tbody');
    tbody.innerHTML = '';
    
    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.id}</td>
            <td class="text-truncate">${event.titulo}</td>
            <td>${formatDate(event.fechainicio)}</td>
            <td class="text-truncate">${event.description}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editEvent(${event.id})">Editar</button>
                <button class="btn-danger" onclick="deleteEvent(${event.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showEventForm() {
    document.getElementById('event-form-container').classList.remove('hidden');
    document.getElementById('event-form-title').textContent = 'Nuevo Evento';
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
    currentEditingId = null;
    currentEditingEntity = 'event';
}

function hideEventForm() {
    document.getElementById('event-form-container').classList.add('hidden');
    currentEditingId = null;
    currentEditingEntity = null;
}

async function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = {
        titulo: document.getElementById('event-titulo').value,
        fechainicio: document.getElementById('event-fechainicio').value,
        description: document.getElementById('event-description').value,
        imagenUrl: document.getElementById('event-imagenurl').value || null
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await makeRequest(`${API_BASE_URL}/eventchronologicals/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showNotification('Evento actualizado correctamente');
        } else {
            await makeRequest(`${API_BASE_URL}/eventchronologicals`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showNotification('Evento creado correctamente');
        }
        
        hideEventForm();
        loadEvents();
    } catch (error) {
        console.error('Error guardando evento:', error);
    }
}

async function editEvent(id) {
    try {
        const event = await makeRequest(`${API_BASE_URL}/eventchronologicals/${id}`);
        
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-titulo').value = event.titulo;
        document.getElementById('event-fechainicio').value = event.fechainicio.split('T')[0];
        document.getElementById('event-description').value = event.description;
        document.getElementById('event-imagenurl').value = event.imagenUrl || '';
        
        document.getElementById('event-form-title').textContent = 'Editar Evento';
        document.getElementById('event-form-container').classList.remove('hidden');
        
        currentEditingId = id;
        currentEditingEntity = 'event';
    } catch (error) {
        console.error('Error cargando evento:', error);
    }
}

async function deleteEvent(id) {
    if (confirm('¿Está seguro de que desea eliminar este evento?')) {
        try {
            await makeRequest(`${API_BASE_URL}/eventchronologicals/${id}`, {
                method: 'DELETE'
            });
            showNotification('Evento eliminado correctamente');
            loadEvents();
        } catch (error) {
            console.error('Error eliminando evento:', error);
        }
    }
}

// ====== PREGUNTAS ======
async function loadQuestions() {
    try {
        const questions = await makeRequest(`${API_BASE_URL}/questionquizzes`);
        renderQuestions(questions);
    } catch (error) {
        console.error('Error cargando preguntas:', error);
    }
}

function renderQuestions(questions) {
    const tbody = document.getElementById('questions-tbody');
    tbody.innerHTML = '';
    
    questions.forEach(question => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${question.id}</td>
            <td class="text-truncate">${question.enunciado}</td>
            <td>${question.tipo}</td>
            <td class="text-truncate">${question.respuestaCorrecta}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editQuestion(${question.id})">Editar</button>
                <button class="btn-danger" onclick="deleteQuestion(${question.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showQuestionForm() {
    document.getElementById('question-form-container').classList.remove('hidden');
    document.getElementById('question-form-title').textContent = 'Nueva Pregunta';
    document.getElementById('question-form').reset();
    document.getElementById('question-id').value = '';
    currentEditingId = null;
    currentEditingEntity = 'question';
}

function hideQuestionForm() {
    document.getElementById('question-form-container').classList.add('hidden');
    currentEditingId = null;
    currentEditingEntity = null;
}

async function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const formData = {
        enunciado: document.getElementById('question-enunciado').value,
        tipo: document.getElementById('question-tipo').value,
        opciones: document.getElementById('question-opciones').value,
        respuestaCorrecta: document.getElementById('question-respuesta').value
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await makeRequest(`${API_BASE_URL}/questionquizzes/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showNotification('Pregunta actualizada correctamente');
        } else {
            await makeRequest(`${API_BASE_URL}/questionquizzes`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showNotification('Pregunta creada correctamente');
        }
        
        hideQuestionForm();
        loadQuestions();
    } catch (error) {
        console.error('Error guardando pregunta:', error);
    }
}

async function editQuestion(id) {
    try {
        const question = await makeRequest(`${API_BASE_URL}/questionquizzes/${id}`);
        
        document.getElementById('question-id').value = question.id;
        document.getElementById('question-enunciado').value = question.enunciado;
        document.getElementById('question-tipo').value = question.tipo;
        document.getElementById('question-opciones').value = question.opciones;
        document.getElementById('question-respuesta').value = question.respuestaCorrecta;
        
        document.getElementById('question-form-title').textContent = 'Editar Pregunta';
        document.getElementById('question-form-container').classList.remove('hidden');
        
        currentEditingId = id;
        currentEditingEntity = 'question';
    } catch (error) {
        console.error('Error cargando pregunta:', error);
    }
}

async function deleteQuestion(id) {
    if (confirm('¿Está seguro de que desea eliminar esta pregunta?')) {
        try {
            await makeRequest(`${API_BASE_URL}/questionquizzes/${id}`, {
                method: 'DELETE'
            });
            showNotification('Pregunta eliminada correctamente');
            loadQuestions();
        } catch (error) {
            console.error('Error eliminando pregunta:', error);
        }
    }
}

// ====== QUIZZES ======
async function loadQuizzes() {
    try {
        const quizzes = await makeRequest(`${API_BASE_URL}/quizmusicales`);
        renderQuizzes(quizzes);
    } catch (error) {
        console.error('Error cargando quizzes:', error);
    }
}

function renderQuizzes(quizzes) {
    const tbody = document.getElementById('quizzes-tbody');
    tbody.innerHTML = '';
    
    quizzes.forEach(quiz => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quiz.id}</td>
            <td class="text-truncate">${quiz.titulo}</td>
            <td>${quiz.duracionMax} min</td>
            <td>${quiz.nivel}</td>
            <td>${quiz.preguntas ? quiz.preguntas.length : 0}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editQuiz(${quiz.id})">Editar</button>
                <button class="btn-danger" onclick="deleteQuiz(${quiz.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showQuizForm() {
    document.getElementById('quiz-form-container').classList.remove('hidden');
    document.getElementById('quiz-form-title').textContent = 'Nuevo Quiz';
    document.getElementById('quiz-form').reset();
    document.getElementById('quiz-id').value = '';
    currentEditingId = null;
    currentEditingEntity = 'quiz';
}

function hideQuizForm() {
    document.getElementById('quiz-form-container').classList.add('hidden');
    currentEditingId = null;
    currentEditingEntity = null;
}

async function handleQuizSubmit(e) {
    e.preventDefault();
    
    const formData = {
        titulo: document.getElementById('quiz-titulo').value,
        duracionMax: parseInt(document.getElementById('quiz-duracionmax').value),
        nivel: document.getElementById('quiz-nivel').value,
        preguntas: []
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await makeRequest(`${API_BASE_URL}/quizmusicales/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showNotification('Quiz actualizado correctamente');
        } else {
            await makeRequest(`${API_BASE_URL}/quizmusicales`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showNotification('Quiz creado correctamente');
        }
        
        hideQuizForm();
        loadQuizzes();
    } catch (error) {
        console.error('Error guardando quiz:', error);
    }
}

async function editQuiz(id) {
    try {
        const quiz = await makeRequest(`${API_BASE_URL}/quizmusicales/${id}`);
        
        document.getElementById('quiz-id').value = quiz.id;
        document.getElementById('quiz-titulo').value = quiz.titulo;
        document.getElementById('quiz-duracionmax').value = quiz.duracionMax;
        document.getElementById('quiz-nivel').value = quiz.nivel;
        
        document.getElementById('quiz-form-title').textContent = 'Editar Quiz';
        document.getElementById('quiz-form-container').classList.remove('hidden');
        
        currentEditingId = id;
        currentEditingEntity = 'quiz';
    } catch (error) {
        console.error('Error cargando quiz:', error);
    }
}

async function deleteQuiz(id) {
    if (confirm('¿Está seguro de que desea eliminar este quiz?')) {
        try {
            await makeRequest(`${API_BASE_URL}/quizmusicales/${id}`, {
                method: 'DELETE'
            });
            showNotification('Quiz eliminado correctamente');
            loadQuizzes();
        } catch (error) {
            console.error('Error eliminando quiz:', error);
        }
    }
}

// ====== CANCIONES ======
async function loadSongs() {
    try {
        const songs = await makeRequest(`${API_BASE_URL}/songs`);
        renderSongs(songs);
    } catch (error) {
        console.error('Error cargando canciones:', error);
    }
}

function renderSongs(songs) {
    const tbody = document.getElementById('songs-tbody');
    tbody.innerHTML = '';
    
    songs.forEach(song => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${song.id}</td>
            <td class="text-truncate">${song.titulo}</td>
            <td>${formatDuration(song.duracion)}</td>
            <td>${formatDate(song.fechaLanzamiento)}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editSong(${song.id})">Editar</button>
                <button class="btn-danger" onclick="deleteSong(${song.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showSongForm() {
    document.getElementById('song-form-container').classList.remove('hidden');
    document.getElementById('song-form-title').textContent = 'Nueva Canción';
    document.getElementById('song-form').reset();
    document.getElementById('song-id').value = '';
    currentEditingId = null;
    currentEditingEntity = 'song';
}

function hideSongForm() {
    document.getElementById('song-form-container').classList.add('hidden');
    currentEditingId = null;
    currentEditingEntity = null;
}

async function handleSongSubmit(e) {
    e.preventDefault();
    
    const formData = {
        titulo: document.getElementById('song-titulo').value,
        duracion: parseInt(document.getElementById('song-duracion').value),
        fechaLanzamiento: document.getElementById('song-fechalanzamiento').value,
        description: document.getElementById('song-description').value,
        audioUrl: document.getElementById('song-audiourl').value || null
    };
    
    try {
        if (currentEditingId) {
            formData.id = currentEditingId;
            await makeRequest(`${API_BASE_URL}/songs/${currentEditingId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            });
            showNotification('Canción actualizada correctamente');
        } else {
            await makeRequest(`${API_BASE_URL}/songs`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            showNotification('Canción creada correctamente');
        }
        
        hideSongForm();
        loadSongs();
    } catch (error) {
        console.error('Error guardando canción:', error);
    }
}

async function editSong(id) {
    try {
        const song = await makeRequest(`${API_BASE_URL}/songs/${id}`);
        
        document.getElementById('song-id').value = song.id;
        document.getElementById('song-titulo').value = song.titulo;
        document.getElementById('song-duracion').value = song.duracion;
        document.getElementById('song-fechalanzamiento').value = song.fechaLanzamiento.split('T')[0];
        document.getElementById('song-description').value = song.description;
        document.getElementById('song-audiourl').value = song.audioUrl || '';
        
        document.getElementById('song-form-title').textContent = 'Editar Canción';
        document.getElementById('song-form-container').classList.remove('hidden');
        
        currentEditingId = id;
        currentEditingEntity = 'song';
    } catch (error) {
        console.error('Error cargando canción:', error);
    }
}

async function deleteSong(id) {
    if (confirm('¿Está seguro de que desea eliminar esta canción?')) {
        try {
            await makeRequest(`${API_BASE_URL}/songs/${id}`, {
                method: 'DELETE'
            });
            showNotification('Canción eliminada correctamente');
            loadSongs();
        } catch (error) {
            console.error('Error eliminando canción:', error);
        }
    }
}

// ====== UTILIDADES ======
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function formatDuration(seconds) {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
    