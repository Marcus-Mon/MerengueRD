const API_BASE_URL = 'https://localhost:5001/api'; // Ajustar según tu configuración
let isEditing = false;

// Utility functions
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO');
}

function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Tab Management
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            loadTabData(tabId);
        });
    });

    loadTabData('artists');
});

function loadTabData(tabId) {
    switch(tabId) {
        case 'artists':
            loadArtists();
            break;
        case 'songs':
            loadSongs();
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
    }
}

// Artists Management
async function loadArtists() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/Artists`);
        if (!response.ok) throw new Error('Error al cargar artistas');
        
        const artists = await response.json();
        displayArtists(artists);
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Error loading artists:', error);
    } finally {
        hideLoading();
    }
}

function displayArtists(artists) {
    const tbody = document.getElementById('artists-tbody');
    tbody.innerHTML = '';
    
    artists.forEach(artist => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${artist.photoUrl ? 
                    `<img src="${artist.photoUrl}" alt="${artist.name}" class="image-preview">` : 
                    '<div class="image-preview" style="background: var(--medium-gray); display: flex; align-items: center; justify-content: center;">Sin foto</div>'
                }
            </td>
            <td><strong>${artist.name}</strong></td>
            <td>${formatDate(artist.birthDate)}</td>
            <td>${artist.nationality || 'N/A'}</td>
            <td>
                <button class="btn-primary btn-sm btn-edit" onclick="editArtist(${artist.id})">✏️ Editar</button>
                <button class="btn-primary btn-sm btn-delete" onclick="deleteArtist(${artist.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showArtistForm() {
    document.getElementById('artist-form').style.display = 'block';
    document.getElementById('artist-form-title').textContent = 'Agregar Artista';
    document.getElementById('artistForm').reset();
    document.getElementById('artist-id').value = '';
    isEditing = false;
}

function hideArtistForm() {
    document.getElementById('artist-form').style.display = 'none';
    document.getElementById('artistForm').reset();
    isEditing = false;
}

async function editArtist(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/Artists/${id}`);
        if (!response.ok) throw new Error('Error al cargar artista');
        
        const artist = await response.json();
        
        document.getElementById('artist-id').value = artist.id;
        document.getElementById('artist-name').value = artist.name;
        document.getElementById('artist-birthdate').value = formatDateForInput(artist.birthDate);
        document.getElementById('artist-nationality').value = artist.nationality || '';
        document.getElementById('artist-biography').value = artist.biography || '';
        document.getElementById('artist-photo').value = artist.photoUrl || '';
        
        document.getElementById('artist-form-title').textContent = 'Editar Artista';
        document.getElementById('artist-form').style.display = 'block';
        isEditing = true;
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteArtist(id) {
    if (!confirm('¿Estás seguro de eliminar este artista?')) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/Artists/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar artista');
        
        showToast('Artista eliminado correctamente');
        loadArtists();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Artist form submission
document.getElementById('artistForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const artistData = {
        name: document.getElementById('artist-name').value,
        birthDate: document.getElementById('artist-birthdate').value,
        nationality: document.getElementById('artist-nationality').value,
        biography: document.getElementById('artist-biography').value,
        photoUrl: document.getElementById('artist-photo').value
    };
    
    showLoading();
    try {
        let response;
        if (isEditing) {
            const id = document.getElementById('artist-id').value;
            artistData.id = parseInt(id);
            response = await fetch(`${API_BASE_URL}/Artists/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(artistData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/Artists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(artistData)
            });
        }
        
        if (!response.ok) throw new Error(isEditing ? 'Error al actualizar artista' : 'Error al crear artista');
        
        showToast(isEditing ? 'Artista actualizado correctamente' : 'Artista creado correctamente');
        hideArtistForm();
        loadArtists();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
});

// Songs Management
async function loadSongs() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/Songs`);
        if (!response.ok) throw new Error('Error al cargar canciones');
        
        const songs = await response.json();
        displaySongs(songs);
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Error loading songs:', error);
    } finally {
        hideLoading();
    }
}

function displaySongs(songs) {
    const tbody = document.getElementById('songs-tbody');
    tbody.innerHTML = '';
    
    songs.forEach(song => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${song.title}</strong></td>
            <td>${song.duration || 'N/A'}</td>
            <td>${formatDate(song.releaseDate)}</td>
            <td>
                ${song.audioUrl ? 
                    `<audio controls style="width: 200px;"><source src="${song.audioUrl}" type="audio/mpeg">Tu navegador no soporta audio.</audio>` : 
                    'Sin audio'
                }
            </td>
            <td>
                <button class="btn-primary btn-sm btn-edit" onclick="editSong(${song.id})">✏️ Editar</button>
                <button class="btn-primary btn-sm btn-delete" onclick="deleteSong(${song.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showSongForm() {
    document.getElementById('song-form').style.display = 'block';
    document.getElementById('song-form-title').textContent = 'Agregar Canción';
    document.getElementById('songForm').reset();
    document.getElementById('song-id').value = '';
    isEditing = false;
}

function hideSongForm() {
    document.getElementById('song-form').style.display = 'none';
    document.getElementById('songForm').reset();
    isEditing = false;
}

async function editSong(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/Songs/${id}`);
        if (!response.ok) throw new Error('Error al cargar canción');
        
        const song = await response.json();
        
        document.getElementById('song-id').value = song.id;
        document.getElementById('song-title').value = song.title;
        document.getElementById('song-duration').value = song.duration || '';
        document.getElementById('song-release-date').value = formatDateForInput(song.releaseDate);
        document.getElementById('song-description').value = song.description || '';
        document.getElementById('song-audio').value = song.audioUrl || '';
        
        document.getElementById('song-form-title').textContent = 'Editar Canción';
        document.getElementById('song-form').style.display = 'block';
        isEditing = true;
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteSong(id) {
    if (!confirm('¿Estás seguro de eliminar esta canción?')) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/Songs/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar canción');
        
        showToast('Canción eliminada correctamente');
        loadSongs();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Song form submission
document.getElementById('songForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const songData = {
        title: document.getElementById('song-title').value,
        duration: document.getElementById('song-duration').value,
        releaseDate: document.getElementById('song-release-date').value,
        description: document.getElementById('song-description').value,
        audioUrl: document.getElementById('song-audio').value
    };
    
    showLoading();
    try {
        let response;
        if (isEditing) {
            const id = document.getElementById('song-id').value;
            songData.id = parseInt(id);
            response = await fetch(`${API_BASE_URL}/Songs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(songData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/Songs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(songData)
            });
        }
        
        if (!response.ok) throw new Error(isEditing ? 'Error al actualizar canción' : 'Error al crear canción');
        
        showToast(isEditing ? 'Canción actualizada correctamente' : 'Canción creada correctamente');
        hideSongForm();
        loadSongs();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
});

// Events Management
async function loadEvents() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/EventChronologicals`);
        if (!response.ok) throw new Error('Error al cargar eventos');
        
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Error loading events:', error);
    } finally {
        hideLoading();
    }
}

function displayEvents(events) {
    const tbody = document.getElementById('events-tbody');
    tbody.innerHTML = '';
    
    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                ${event.imageUrl ? 
                    `<img src="${event.imageUrl}" alt="${event.title}" class="image-preview">` : 
                    '<div class="image-preview" style="background: var(--medium-gray); display: flex; align-items: center; justify-content: center;">Sin imagen</div>'
                }
            </td>
            <td><strong>${event.title}</strong></td>
            <td>${formatDate(event.startDate)}</td>
            <td>${formatDate(event.endDate)}</td>
            <td>${event.description ? (event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description) : 'Sin descripción'}</td>
            <td>
                <button class="btn-primary btn-sm btn-edit" onclick="editEvent(${event.id})">✏️ Editar</button>
                <button class="btn-primary btn-sm btn-delete" onclick="deleteEvent(${event.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showEventForm() {
    document.getElementById('event-form').style.display = 'block';
    document.getElementById('event-form-title').textContent = 'Agregar Evento';
    document.getElementById('eventForm').reset();
    document.getElementById('event-id').value = '';
    isEditing = false;
}

function hideEventForm() {
    document.getElementById('event-form').style.display = 'none';
    document.getElementById('eventForm').reset();
    isEditing = false;
}

async function editEvent(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/EventChronologicals/${id}`);
        if (!response.ok) throw new Error('Error al cargar evento');
        
        const event = await response.json();
        
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-title').value = event.title;
        document.getElementById('event-start-date').value = formatDateForInput(event.startDate);
        document.getElementById('event-end-date').value = formatDateForInput(event.endDate);
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-image').value = event.imageUrl || '';
        
        document.getElementById('event-form-title').textContent = 'Editar Evento';
        document.getElementById('event-form').style.display = 'block';
        isEditing = true;
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteEvent(id) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/EventChronologicals/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar evento');
        
        showToast('Evento eliminado correctamente');
        loadEvents();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Event form submission
document.getElementById('eventForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const eventData = {
        title: document.getElementById('event-title').value,
        startDate: document.getElementById('event-start-date').value,
        endDate: document.getElementById('event-end-date').value,
        description: document.getElementById('event-description').value,
        imageUrl: document.getElementById('event-image').value
    };
    
    showLoading();
    try {
        let response;
        if (isEditing) {
            const id = document.getElementById('event-id').value;
            eventData.id = parseInt(id);
            response = await fetch(`${API_BASE_URL}/EventChronologicals/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/EventChronologicals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
        }
        
        if (!response.ok) throw new Error(isEditing ? 'Error al actualizar evento' : 'Error al crear evento');
        
        showToast(isEditing ? 'Evento actualizado correctamente' : 'Evento creado correctamente');
        hideEventForm();
        loadEvents();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
});

// Questions Management
async function loadQuestions() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/QuestionQuizzes`);
        if (!response.ok) throw new Error('Error al cargar preguntas');
        
        const questions = await response.json();
        displayQuestions(questions);
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Error loading questions:', error);
    } finally {
        hideLoading();
    }
}

function displayQuestions(questions) {
    const tbody = document.getElementById('questions-tbody');
    tbody.innerHTML = '';
    
    questions.forEach(question => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${question.text ? (question.text.length > 100 ? question.text.substring(0, 100) + '...' : question.text) : 'Sin texto'}</td>
            <td><span class="badge">${question.type || 'N/A'}</span></td>
            <td>${question.correctAnswer || 'N/A'}</td>
            <td>
                <button class="btn-primary btn-sm btn-edit" onclick="editQuestion(${question.id})">✏️ Editar</button>
                <button class="btn-primary btn-sm btn-delete" onclick="deleteQuestion(${question.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showQuestionForm() {
    document.getElementById('question-form').style.display = 'block';
    document.getElementById('question-form-title').textContent = 'Agregar Pregunta';
    document.getElementById('questionForm').reset();
    document.getElementById('question-id').value = '';
    isEditing = false;
}

function hideQuestionForm() {
    document.getElementById('question-form').style.display = 'none';
    document.getElementById('questionForm').reset();
    isEditing = false;
}

async function editQuestion(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/QuestionQuizzes/${id}`);
        if (!response.ok) throw new Error('Error al cargar pregunta');
        
        const question = await response.json();
        
        document.getElementById('question-id').value = question.id;
        document.getElementById('question-text').value = question.text;
        document.getElementById('question-type').value = question.type;
        document.getElementById('question-options').value = question.options ? question.options.join(', ') : '';
        document.getElementById('question-answer').value = question.correctAnswer;
        
        document.getElementById('question-form-title').textContent = 'Editar Pregunta';
        document.getElementById('question-form').style.display = 'block';
        isEditing = true;
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteQuestion(id) {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/QuestionQuizzes/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar pregunta');
        
        showToast('Pregunta eliminada correctamente');
        loadQuestions();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Question form submission
document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const opciones = document.getElementById('question-options').value;
    const questionData = {
        text: document.getElementById('question-text').value,
        type: document.getElementById('question-type').value,
        options: opciones ? opciones.split(',').map(opt => opt.trim()) : [],
        correctAnswer: document.getElementById('question-answer').value
    };
    
    showLoading();
    try {
        let response;
        if (isEditing) {
            const id = document.getElementById('question-id').value;
            questionData.id = parseInt(id);
            response = await fetch(`${API_BASE_URL}/QuestionQuizzes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questionData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/QuestionQuizzes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questionData)
            });
        }
        
        if (!response.ok) throw new Error(isEditing ? 'Error al actualizar pregunta' : 'Error al crear pregunta');
        
        showToast(isEditing ? 'Pregunta actualizada correctamente' : 'Pregunta creada correctamente');
        hideQuestionForm();
        loadQuestions();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
});

// Quizzes Management
async function loadQuizzes() {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/QuizMusicals`);
        if (!response.ok) throw new Error('Error al cargar quizzes');
        
        const quizzes = await response.json();
        displayQuizzes(quizzes);
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error('Error loading quizzes:', error);
    } finally {
        hideLoading();
    }
}

function displayQuizzes(quizzes) {
    const tbody = document.getElementById('quizzes-tbody');
    tbody.innerHTML = '';
    
    quizzes.forEach(quiz => {
        const levelText = quiz.difficultyLevel == 1 ? 'Fácil' : 
                         quiz.difficultyLevel == 2 ? 'Intermedio' : 
                         quiz.difficultyLevel == 3 ? 'Difícil' : 'N/A';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${quiz.title}</strong></td>
            <td>${quiz.maxDuration ? quiz.maxDuration + ' min' : 'N/A'}</td>
            <td><span class="badge">${levelText}</span></td>
            <td>${quiz.description ? (quiz.description.length > 100 ? quiz.description.substring(0, 100) + '...' : quiz.description) : 'Sin descripción'}</td>
            <td>
                <button class="btn-primary btn-sm btn-edit" onclick="editQuiz(${quiz.id})">✏️ Editar</button>
                <button class="btn-primary btn-sm btn-delete" onclick="deleteQuiz(${quiz.id})">🗑️ Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showQuizForm() {
    document.getElementById('quiz-form').style.display = 'block';
    document.getElementById('quiz-form-title').textContent = 'Agregar Quiz';
    document.getElementById('quizForm').reset();
    document.getElementById('quiz-id').value = '';
    isEditing = false;
}

function hideQuizForm() {
    document.getElementById('quiz-form').style.display = 'none';
    document.getElementById('quizForm').reset();
    isEditing = false;
}

async function editQuiz(id) {
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/QuizMusicals/${id}`);
        if (!response.ok) throw new Error('Error al cargar quiz');
        
        const quiz = await response.json();
        
        document.getElementById('quiz-id').value = quiz.id;
        document.getElementById('quiz-title').value = quiz.title;
        document.getElementById('quiz-duration').value = quiz.maxDuration;
        document.getElementById('quiz-level').value = quiz.difficultyLevel;
        document.getElementById('quiz-description').value = quiz.description || '';
        
        document.getElementById('quiz-form-title').textContent = 'Editar Quiz';
        document.getElementById('quiz-form').style.display = 'block';
        isEditing = true;
        
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

async function deleteQuiz(id) {
    if (!confirm('¿Estás seguro de eliminar este quiz?')) return;
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE_URL}/QuizMusicals/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar quiz');
        
        showToast('Quiz eliminado correctamente');
        loadQuizzes();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Quiz form submission
document.getElementById('quizForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const quizData = {
        title: document.getElementById('quiz-title').value,
        maxDuration: parseInt(document.getElementById('quiz-duration').value),
        difficultyLevel: parseInt(document.getElementById('quiz-level').value),
        description: document.getElementById('quiz-description').value
    };
    
    showLoading();
    try {
        let response;
        if (isEditing) {
            const id = document.getElementById('quiz-id').value;
            quizData.id = parseInt(id);
            response = await fetch(`${API_BASE_URL}/QuizMusicals/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });
        } else {
            response = await fetch(`${API_BASE_URL}/QuizMusicals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });
        }
        
        if (!response.ok) throw new Error(isEditing ? 'Error al actualizar quiz' : 'Error al crear quiz');
        
        showToast(isEditing ? 'Quiz actualizado correctamente' : 'Quiz creado correctamente');
        hideQuizForm();
        loadQuizzes();
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
});
    