'use strict'

function Note(name, created, category, content) {
    this.name = name;
    this.created = created;
    this.category = category;
    this.content = content;
}

var currentNotes = [];

function predefineNotes() {
    currentNotes.push(new Note("Shopping List", "April 20, 2021", "Task", "Tomatoes, bread"));
    currentNotes.push(new Note("The theory of evolution", "April 27, 2021", "Random Thought",
        "Evolution is change in the heritable characteristics of biological populations over successive generations"));
    currentNotes.push(new Note("New Feature", "May 05, 2021", "Idea", "Implement bootstrap table borders"));
    currentNotes.push(new Note("William Gaddis", "May 07, 2021", "Quote", "If it is not beautiful for someone, it does not exist."));
    currentNotes.push(new Note("Books", "May 15, 2021", "Task", "Javascript in Depth"));
    currentNotes.push(new Note("Shopping List", "May 23, 2021", "Task", "Eggs, bread crumbs, water"));
    currentNotes.push(new Note("New Feature", "June 02, 2021", "Idea", "Implement archive notes"));
}

// Wraps element in <tagName> adding classes if neccesary
function wrap(tagName, element) {
    var wrapper = document.createElement(tagName);
    if (Array.isArray(element)) {
        element.forEach(item => wrapper.appendChild(item));
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

function NoteHtml(note) {
    return {
        icon: () => {
            var icon = wrap("i", null, createIcon(note.category), "icon");

            return wrap("section", icon, "col-1", "text-center", "rounded", "bg-dark", "d-inline-block");
        },
        name: () => {
            var name = document.createTextNode(note.name);
            return wrap("section", wrap("p", name, "text-truncate"), "col-2", "d-inline-block", "align-self-center");
        },
        date: () => {
            var date = document.createTextNode(note.created);
            return wrap("section", wrap("p", date, "text-truncate"), "col-2", "d-inline-block", "align-self-center");
        },
        category: () => {
            var category = document.createTextNode(note.category);
            return wrap("section", wrap("p", category, "text-truncate"), "col-1", "d-flex", "align-self-center");
        },
        content: () => {
            var content = document.createTextNode(note.content);
            if (note.category == "Quote")
                content = wrap("q", content);
            return wrap("section", wrap("p", content, "text-truncate"), "col-3", "d-flex", "align-self-center");
        },
        dates: () => {
            var dates = document.createTextNode(note.created);
            return wrap("section", wrap("p", dates, "text-truncate"), "col", "d-flex", "align-self-center");
        },
        controls: () => {
            let edit = wrap("i", null, createIcon("edit"), "text-light", "iconButton");
            let remove = wrap("i", null, createIcon("remove"), "text-light", "iconButton");
            let archive = wrap("i", null, createIcon("archive"), "text-light", "iconButton");

            let editButton = wrap("button", edit, "btn", "btn-primary", "w-100");
            let removeButton = wrap("button", remove, "btn", "btn-primary", "w-100");
            let archiveButton = wrap("button", archive, "btn", "btn-primary", "w-100");

            return wrap("section", [editButton, removeButton, archiveButton], "col", "btn-group", "d-flex");
        }
    }
}


function displayNotes() {
    var notesContainer = document.querySelector("#notes");
    currentNotes.forEach(note => {
        var noteContainer = document.createElement("article");
        noteContainer.classList.add("row");
        noteContainer.classList.add("rounded");
        noteContainer.classList.add("note");
        noteContainer.classList.add("bg-primary");
        noteContainer.classList.add("text-light");
        noteContainer.classList.add("justify-content-center");

        noteContainer.appendChild(NoteHtml(note).icon());
        noteContainer.appendChild(NoteHtml(note).name());
        noteContainer.appendChild(NoteHtml(note).date());
        noteContainer.appendChild(NoteHtml(note).category());
        noteContainer.appendChild(NoteHtml(note).content());
        noteContainer.appendChild(NoteHtml(note).dates());
        noteContainer.appendChild(NoteHtml(note).controls());

        notesContainer.appendChild(noteContainer);
    });
}

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

function constructNotesTable(notesTable, currentNotes) {
    currentNotes.forEach(note => {
        var row = notesTable.insertRow();
        row.classList.add('border');

        // Add icon depending on notes category
        let iconCell = row.insertCell();
        iconCell.classList.add("icon-wrapper");
        iconCell.classList.add("align-middle");

        let icon = createIcon(note.category);
        iconCell.appendChild(icon);

        for (const [key, value] of Object.entries(note)) {
            let cell = row.insertCell();
            cell.innerHTML = value;
            if (key == "content") cell.classList.add("content");
        }

        let dates = row.insertCell();

        // Add buttons to edit remove archive
        let buttons = row.insertCell();
    });
}

function addEvents() {

}