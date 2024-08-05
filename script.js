/*************************************************************************
 * Create Note Popup Logic
 **************************************************************************/

function popup() {

    const popupContainer = document.createElement("div");

    popupContainer.innerHTML = `
    <div id="popupContainer">
        <h1>New Note</h1>
        <input type="text" id="note-title" placeholder="Inpute title..."/>
        <textarea id="note-text" placeholder="Enter your note..."></textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="createNote()">Create Note</button>
            <button id="closeBtn" onclick="closePopup()">Close</button>
        </div>
    </div>
    `;
    document.body.appendChild(popupContainer);
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    if(popupContainer) {
        popupContainer.remove();
    }
}

function createNote() {

    const popupContainer = document.getElementById('popupContainer');
    const noteText = document.getElementById('note-text').value;
    const noteTitle = document.getElementById('note-title').value;
    if ((noteText.trim() !== '') && (noteTitle.trim())) {
        const note = {
        id: new Date().getTime(),
        title: noteTitle,
        text: noteText
        };

        const existingNotes = JSON.parse(localStorage.getItem('notes')) || [];
        existingNotes.push(note);

        localStorage.setItem('notes', JSON.stringify(existingNotes));

        document.getElementById('note-text').value = '';
        document.getElementById('note-title').value = '';

        popupContainer.remove();
        displayNotes();
    }
}


/*************************************************************************
 * Display Notes Logic
 **************************************************************************/

function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <h2>${note.title}</h2>
        <span>${note.text.replaceAll('\n', '<br/>')}</span>
        <div id="noteBtns-container">
            <button id="editBtn" onclick="editNote(${note.id})"><i class="fa-solid fa-pen"></i></button>
            <button id="deleteBtn" onclick="deleteNote(${note.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;
        notesList.appendChild(listItem);
    });
}


/*************************************************************************
 * Edit Note Popup Logic
 **************************************************************************/

function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => note.id == noteId);
    const noteTitle = noteToEdit ? noteToEdit.title : '';
    const noteText = noteToEdit ? noteToEdit.text : '';
    const editingPopup = document.createElement("div");
    
    editingPopup.innerHTML = `
    <div id="editing-container" data-note-id="${noteId}">
        <h1>Edit Note</h1>
        <input type="text" id="note-title" value="${noteTitle}" />
        <textarea id="note-text">${noteText.replaceAll('<br/>', '\r\n')}</textarea>
        <div id="btn-container">
            <button id="submitBtn" onclick="updateNote()">Done</button>
            <button id="closeBtn" onclick="closeEditPopup()">Cancel</button>
        </div>
    </div>
    `;

    document.body.appendChild(editingPopup);
}

function closeEditPopup() {
    const editingPopup = document.getElementById("editing-container");

    if(editingPopup) {
        editingPopup.remove();
    }
}

function updateNote() {
    const noteText = document.getElementById('note-text').value.trim();
    const noteTitle = document.getElementById('note-title').value.trim();
    const editingPopup = document.getElementById('editing-container');

    if ((noteText !== '') && (noteTitle !== '')) {
        const noteId = editingPopup.getAttribute('data-note-id');
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        // Find the note to update
        const updatedNotes = notes.map(note => {
            if (note.id == noteId) {
                return { id: note.id, title: noteTitle, text: noteText };
            }
            return note;
        });

        // Update the notes in local storage
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        // Close the editing popup
        editingPopup.remove();

        // Refresh the displayed notes
        displayNotes();
    }
}

/*************************************************************************
 * Delete Note Logic
 **************************************************************************/

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

// search function
const search = () => {
    const searchbox = document.getElementById('searchBox').value.toUpperCase();
    const listItem = document.getElementById('notes-list');
    const items = document.querySelectorAll('li');
    const keyMatch = listItem.querySelectorAll('h2');

    for(var i=0;i < keyMatch.length;i++){
        let match = items[i].getElementsByTagName('h2')[0];

        if(match){
            let textvalue = match.textContent || match.innerHTML;

            if(textvalue.toUpperCase().indexOf(searchbox) > -1){
                items[i].style.display = "";
            }else{
                items[i].style.display = "none";
            }
        }
    }
}

displayNotes();