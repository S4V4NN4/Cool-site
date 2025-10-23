const fills = document.querySelectorAll('.fill');
const empties = document.querySelectorAll('.empty');

let draggedItem = null;

// Обработчики событий для перетаскиваемого элемента
for (const fill of fills) {
    fill.addEventListener('dragstart', dragStart);
    fill.addEventListener('dragend', dragEnd);
}

// Для каждой пустой зоны добавляем события
for (const empty of empties) {
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);
}

function dragStart() {
    draggedItem = this;
    this.classList.add('hold');
    setTimeout(() => this.classList.add('invisible'), 0);
}

function dragEnd() {
    this.className = 'fill';
    draggedItem = null;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('hovered');
}

function dragLeave() {
    this.classList.remove('hovered');
}

function dragDrop() {
    this.classList.remove('hovered');

    const hasFill = this.querySelector('.fill');

    if (!hasFill && draggedItem) {
        this.append(draggedItem);
    }
}

