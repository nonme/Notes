'use strict'

var uid = function getId() {
    let uniqueId = 0;

    return () => {
        return uniqueId++;
    }
}();

function Note(name, created, category, content) {
    this.id = uid();
    this.name = name;
    this.created = created;
    this.category = category;
    this.content = content;

    this.edit = (name, created, category, content) => {
        this.name = name;
        this.created = created;
        this.category = category;
        this.content = content;
    }
}

var currentNotes = {};
var archivedNotes = {};
var notesInfo = {};

const Table = {
    Active: 'Active',
    Archived: 'Archived'
};

var currentTable = Table.Active;

function predefineNotes() {
    currentNotes[0] = new Note("Shopping List", "April 20, 2021", "Task", "Tomatoes, bread");
    currentNotes[1] = new Note("The theory of evolution", "April 27, 2021", "Random Thought",
        "Evolution is change in the heritable characteristics of biological populations over successive generations");
    currentNotes[2] = new Note("New Feature", "May 05, 2021", "Idea", "Implement bootstrap table borders");
    currentNotes[3] = new Note("William Gaddis", "May 07, 2021", "Quote", "If it is not beautiful for someone, it does not exist.");
    currentNotes[4] = new Note("Books", "May 15, 2021", "Task", "Javascript in Depth");
    currentNotes[5] = new Note("Doctor appointment", "May 23, 2021", "Task", "Move appointment from 23/11/2021 to 3/1/2022");
    currentNotes[6] = new Note("New Feature #2", "June 02, 2021", "Idea", "Implement archive notes by 19.1.2022");

    calculateNotes();
}

function createPage() {
    createNotes(currentNotes);
    updateTotalNotes();

    addEvents();
}

function toggleTable() {
    if (currentTable == Table.Active) {
        currentTable = Table.Archived;
        createNotes(archivedNotes);

        document.getElementById("tableHeaderName").textContent = "Archive";
    } else {
        currentTable = Table.Active;
        createNotes(currentNotes);

        document.getElementById("tableHeaderName").textContent = "Notes";
    }

}

function createNotes(notes) {
    var notesContainer = document.querySelector("#notes");

    while (notesContainer.lastChild.id != "notesHeader") {
        notesContainer.removeChild(notesContainer.lastChild);
    }

    Object.values(notes).forEach((note, index) => {
        var id = "note__" + index;
        var noteContainer = createNote(note, id);
        notesContainer.appendChild(noteContainer);
    });
}

function createTotalNotes() {
    var totalNotesContainer = document.querySelector("#totalNotes");

    while (totalNotesContainer.lastChild.id != "totalHeader") {
        totalNotesContainer.removeChild(totalNotesContainer.lastChild);
    }

    ["Task", "Idea", "Quote", "Random Thought"].forEach(
        category => {
            let noteSummary = createNoteSummary(category);
            totalNotesContainer.appendChild(noteSummary);
        });
}

function createNoteSummary(category) {
    let noteSummary = wrap("article", null, "row", "rounded", "note", "bg-light", "text-dark",
        "shadow", "justify-content-start", "mt-2", "border");

    let icon = wrap("i", null, createIcon(category), "icon", "text-white");

    let iconSection = wrap("section", icon, "col-auto", "text-center", "rounded-left", "bg-dark", "d-flex", "m-1");
    let categoryName = wrap("section", category, "col-4", "d-flex", "align-self-center");
    let active = wrap("section", notesInfo[category].active.toString(), "col-2", "d-flex", "align-self-center", "justify-content-center");
    let archieved = wrap("section", notesInfo[category].archieved.toString(), "col-2", "d-flex", "align-self-center", "justify-content-center");

    noteSummary.appendChild(iconSection);
    noteSummary.appendChild(categoryName);
    noteSummary.appendChild(active);
    noteSummary.appendChild(archieved);
    return noteSummary;
}

function updateTotalNotes() {
    calculateNotes();
    createTotalNotes();
}

function calculateNotes() {
    ["Task", "Idea", "Quote", "Random Thought"].forEach(
        note => notesInfo[note] = { active: 0, archieved: 0 });

    Object.values(currentNotes).forEach(note => {
        notesInfo[note.category].active++;
    });
    Object.values(archivedNotes).forEach(note => {
        notesInfo[note.category].archieved++;
    });
}

function createNote(note, id) {
    var noteContainer = wrap("article", null, "row", "rounded", "note", "bg-light", "text-dark",
        "shadow", "justify-content-start", "mt-2", "border");

    noteContainer.id = id;

    let noteNode = new NoteHtml(note, id);
    noteContainer.appendChild(noteNode.icon("col-auto"));
    noteContainer.appendChild(noteNode.name("col-2"));
    noteContainer.appendChild(noteNode.date("col-2"));
    noteContainer.appendChild(noteNode.category("col-1"));
    noteContainer.appendChild(noteNode.content("col-3"));
    noteContainer.appendChild(noteNode.dates("col-2"));
    noteContainer.appendChild(noteNode.controls("col"));

    return noteContainer;
}

function replaceNote(note) {
    let oldNote = document.getElementById(note.id);
    let newNote = createNote(note.note, note.id);

    oldNote.replaceWith(newNote);
}

function removeNote(note) {
    let notesContainer = document.querySelector("#notes");
    let noteToRemove = document.getElementById(note.id);
    notesContainer.removeChild(noteToRemove);

    let id = note.note.id;
    if (currentTable == Table.Active)
        delete currentNotes[id];
    else
        delete archivedNotes[id];

    updateTotalNotes();
}

function archiveNote(note) {
    let notesContainer = document.querySelector("#notes");
    let noteToRemove = document.getElementById(note.id);
    notesContainer.removeChild(noteToRemove);

    let id = note.note.id;
    if (currentTable == Table.Active) {
        archivedNotes[id] = note.note;
        delete currentNotes[id];
    } else {
        currentNotes[id] = note.note;
        delete archivedNotes[id];
    }
    updateTotalNotes();
}

function addEvents() {
    let newNoteButton = document.getElementById("createNoteButton");
    newNoteButton.setAttribute("data-target", "#editModal");
    newNoteButton.setAttribute("data-toggle", "modal");
    newNoteButton.addEventListener("click", () => {
        let header = document.getElementById("editModalLabel");
        header.textContent = "New";

        let nameInput = document.getElementById("name");
        nameInput.placeholder = "Name";
        nameInput.value = "";

        let createdInput = document.getElementById("created");
        createdInput.placeholder = "January 19, 2022";
        createdInput.value = "";
        createdInput.disabled = false;

        let categoryInput = document.getElementById("category");
        categoryInput.value = "Task";

        let contentInput = document.getElementById("content");
        contentInput.value = "";
        contentInput.placeholder = "Put your wonderful note here..";

        let saveEditButton = document.getElementById("saveEditButton");
        saveEditButton.onclick = () => {
            let notesContainer = document.querySelector("#notes");
            let note = new Note(nameInput.value, createdInput.value, categoryInput.value, contentInput.value);
            currentNotes[note.id] = note;
            let noteContainer = createNote(note, "note__" + note.id);
            notesContainer.appendChild(noteContainer);
            updateTotalNotes();

            $('#editModal').modal('toggle');
        };
    });

    let toggleTableButton = document.getElementById("toggleTableButton");
    toggleTableButton.addEventListener("click", () => {
        toggleTable();
    });
}

function NoteHtml(note, id) {
    this.note = note;
    this.id = id;
    return {
        original: this.note,
        icon: (size) => {
            var icon = wrap("i", null, createIcon(this.note.category), "icon", "text-white");

            return wrap("section", icon, size, "text-center", "rounded-left", "bg-dark", "d-inline-block", "m-1");
        },
        name: (size) => {
            var name = document.createTextNode(this.note.name);
            return wrap("section", wrap("p", name, "text-truncate"), size, "d-inline-block", "align-self-center");
        },
        date: (size) => {
            var date = document.createTextNode(this.note.created);
            return wrap("section", wrap("p", date, "text-truncate"), size, "d-inline-block", "align-self-center");
        },
        category: (size) => {
            var category = document.createTextNode(this.note.category);
            return wrap("section", wrap("p", category, "text-truncate"), size, "d-flex", "align-self-center");
        },
        content: (size) => {
            var content = document.createTextNode(this.note.content);
            if (this.note.category == "Quote")
                content = wrap("q", content);
            return wrap("section", wrap("p", content, "text-truncate"), size, "d-flex", "align-self-center");
        },
        dates: (size) => {
            const regexp = /\d{1,2}[.\/\\]\d{1,2}[.\/\\]\d{2,4}/g;
            const dates = [...this.note.content.matchAll(regexp)];

            var datesElement = document.createTextNode(dates.join(', '));
            return wrap("section", wrap("p", datesElement, "text-truncate"), size, "d-flex", "align-self-center");
        },
        controls: (size) => {
            let edit = wrap("i", null, createIcon("edit"), "text-dark", "iconButton");
            let remove = wrap("i", null, createIcon("remove"), "text-dark", "iconButton");
            let archive = wrap("i", null, createIcon("archive"), "text-dark", "iconButton");

            let editButton = wrap("button", edit, "btn", "btn-light", "w-100", "p-0");
            editButton.setAttribute("data-target", "#editModal");
            editButton.setAttribute("data-toggle", "modal");
            editButton.addEventListener("click", () => {
                let header = document.getElementById("editModalLabel");
                header.textContent = "Edit";

                let nameInput = document.getElementById("name");
                let createdInput = document.getElementById("created");
                let categoryInput = document.getElementById("category");
                let contentInput = document.getElementById("content");

                nameInput.value = this.note.name;
                createdInput.value = this.note.created;
                createdInput.disabled = true;
                categoryInput.value = this.note.category;
                contentInput.value = this.note.content;

                let saveEditButton = document.getElementById("saveEditButton");
                saveEditButton.onclick = () => {
                    this.note.edit(nameInput.value, createdInput.value, categoryInput.value, contentInput.value);
                    replaceNote(this);

                    $('#editModal').modal('toggle');
                };
            });

            let removeButton = wrap("button", remove, "btn", "btn-light", "w-100", "p-0");
            removeButton.setAttribute("data-target", "#removeModal");
            removeButton.setAttribute("data-toggle", "modal");
            removeButton.addEventListener("click", () => {
                let removeNoteButton = document.getElementById("removeNoteButton");
                removeNoteButton.onclick = () => {
                    removeNote(this);
                    $('#removeModal').modal('toggle');
                }
            });
            let archiveButton = wrap("button", archive, "btn", "btn-light", "w-100", "p-0");
            archiveButton.addEventListener("click", () => {
                archiveNote(this);
            });

            return wrap("section", [editButton, removeButton, archiveButton], size, "btn-group", "d-flex", "rounded");
        }
    }
}

// Wraps element in <tagName> adding classes if neccesary
function wrap(tagName, element) {
    var wrapper = document.createElement(tagName);
    if (Array.isArray(element)) {
        element.forEach(item => wrapper.appendChild(item));
    } else if (typeof element === 'string') {
        wrapper.appendChild(document.createTextNode(element));
    } else if (element) {
        wrapper.appendChild(element);
    }

    if (arguments.length > 2) {
        let classes = [].slice.call(arguments, [2]);
        classes.forEach(class_ => {
            wrapper.classList.add(class_);
        });
    }
    return wrapper;
};


function createIcon(iconKeyword) {
    switch (iconKeyword.toLowerCase()) {
        case "task":
            return "bi-shop";
        case "random thought":
            return "bi-eyeglasses";
        case "quote":
            return "bi-quote";
        case "idea":
            return "bi-lightbulb";
        case "edit":
            return "bi-pencil";
        case "remove":
            return "bi-trash";
        case "archive":
            return "bi-archive";
    };
}