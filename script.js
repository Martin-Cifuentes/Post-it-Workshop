// variables principales del DOM 
const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;

// Cambie esto: antes solo tenía un color fijo ("note-yellow"), ahora puse varios en cosito de color para que si sean aleatorios
const colors = ['#f28b82','#fbbc04','#fff475','#ccff90','#a7ffeb','#cbf0f8','#aecbfa','#d7aefb'];

// Crear una nota en el DOM 
function createNoteElement(text, color) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    noteDiv.style.background = color;
    noteDiv.textContent = text;

    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';
    noteDiv.appendChild(deleteButton);

    return noteDiv;
}

// Guardar todas las notas en localStorage 
function saveNotes() {
    const notes = [];
    // antes no guardaba nada, ahora recorro todas las notas y saco texto y color
    document.querySelectorAll('.note').forEach(note => {
        const text = note.textContent.slice(0, -1); // le quito la x del boton
        const color = note.style.background;
        notes.push({ text, color });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Cargar notas desde localStorage 
function loadNotes() {
    // antes estaba como [], ahora sí leo del localStorage
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);
            notesContainer.appendChild(newNote);
        });
    }
}

// Aplicar el tema inicial (oscuro o claro)
function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    }
}

// Eventos 
noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});

toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        noteInput.value = '';
        addButton.disabled = true;
        // antes duplicaba la nota al crearla, quité esa segunda línea
        saveNotes();
    }
});

notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

//  Editar nota con doble click 
notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);
        target.textContent = '';
        target.classList.add('editing');

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();

        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);
            saveNotes();
        }

        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

//  Hover visual de las notas 
notesContainer.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    }
});

notesContainer.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('note')) {
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
});

//  Inicialización 
setInitialTheme();
loadNotes();
