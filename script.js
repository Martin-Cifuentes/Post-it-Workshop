// selecciono los elementos que voy a usar del html
const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;

//Corrección: antes solo había un color, ahora puse varios para que las notas salgan diferentes
const colors = ['note-yellow', 'note-blue', 'note-pink'];

function createNoteElement(text, colorClass = colors[0]) {
  const noteDiv = document.createElement('div');
  noteDiv.classList.add('note', colorClass);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('note-content');
  contentDiv.textContent = text || '';
  noteDiv.appendChild(contentDiv);

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.setAttribute('aria-label', 'Eliminar nota');
  deleteBtn.textContent = '×';
  noteDiv.appendChild(deleteBtn);

  return noteDiv;
}

// Corrección: esta función no existía y el código la llamaba, por eso la agregué.
// ahora guarda todas las notas con su texto y color en localStorage
function saveNotes() {
  const notes = Array.from(notesContainer.querySelectorAll('.note')).map(note => {
    const content = note.querySelector('.note-content')?.textContent || '';
    const color = Array.from(note.classList).find(c => c.startsWith('note-')) || colors[0];
    return { text: content.trim(), color };
  }).filter(n => n.text !== '');
  localStorage.setItem('notes', JSON.stringify(notes));
}

// antes intentaba leer de un array vacío y fallaba.
// ahora leo desde localStorage y reconstruyo las notas guardadas
function loadNotes() {
  const raw = localStorage.getItem('notes');
  if (!raw) return;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    notesContainer.innerHTML = '';
    arr.forEach(n => {
      const el = createNoteElement(n.text || '', n.color || colors[0]);
      notesContainer.appendChild(el);
    });
  } catch (e) {
    console.error('Error leyendo notas guardadas:', e);
  }
}

function setInitialTheme() {
  const isDark = localStorage.getItem('isDarkMode') === 'true';
  if (isDark) {
    body.classList.add('dark-mode');
    toggleThemeButton.textContent = 'Modo Claro';
  } else {
    toggleThemeButton.textContent = 'Modo Oscuro';
  }
}

noteInput.addEventListener('input', () => {
  addButton.disabled = noteInput.value.trim() === '';
});

// Corrección: antes agregaba la nota dos veces, dejé solo una para que no se duplique
addButton.addEventListener('click', () => {
  const text = noteInput.value.trim();
  if (!text) return;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const note = createNoteElement(text, color);
  notesContainer.appendChild(note);

  noteInput.value = '';
  addButton.disabled = true;
  saveNotes();
});

noteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addButton.click();
  }
});

notesContainer.addEventListener('click', (e) => {
  const del = e.target.closest('.delete-btn');
  if (del) {
    const note = del.closest('.note');
    if (note) {
      note.remove();
      saveNotes();
    }
  }
});

// Corrección: cambié la forma de editar notas.
// ahora oculto el texto original, muestro un textarea y al guardar actualizo localStorage
notesContainer.addEventListener('dblclick', (e) => {
  const note = e.target.closest('.note');
  if (!note || note.classList.contains('editing')) return;

  const contentDiv = note.querySelector('.note-content');
  const currentText = contentDiv ? contentDiv.textContent : '';

  note.classList.add('editing');
  contentDiv.style.display = 'none';

  const textarea = document.createElement('textarea');
  textarea.classList.add('editor');
  textarea.value = currentText;

  const deleteBtn = note.querySelector('.delete-btn');
  note.insertBefore(textarea, deleteBtn);
  textarea.focus();

  function finishEdit() {
    const newText = textarea.value.trim();
    if (newText === '') {
      note.remove();
    } else {
      contentDiv.textContent = newText;
      contentDiv.style.display = '';
      textarea.remove();
      note.classList.remove('editing');
    }
    saveNotes();
  }

  textarea.addEventListener('blur', finishEdit);
  textarea.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      finishEdit();
    } else if (ev.key === 'Escape') {
      textarea.value = currentText;
      textarea.blur();
    }
  });
});

toggleThemeButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  localStorage.setItem('isDarkMode', isDark);
  toggleThemeButton.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
});

setInitialTheme();
loadNotes();
