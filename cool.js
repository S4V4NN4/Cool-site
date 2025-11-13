document.addEventListener('DOMContentLoaded', function () {
  const select = document.getElementById('qualityInput');
  const addBtn = document.getElementById('addBtn');
  const clearBtn = document.getElementById('clearBtn');
  const list = document.getElementById('coolList');

  let qualities = JSON.parse(localStorage.getItem('coolQualities')) || [];
  let dragStartIndex = null;

  function showList() {
    list.innerHTML = '';

    if (qualities.length === 0) {
      list.innerHTML = '<li>No cool qualities yet</li>';
      return;
    }

    qualities.forEach((quality, index) => {
      const li = document.createElement('li');
      li.textContent = quality + ' ';
      li.draggable = true;

      const del = document.createElement('button');
      del.textContent = 'x';
      del.addEventListener('click', () => {
        qualities.splice(index, 1);
        saveAndShow();
      });
      li.appendChild(del);

      li.addEventListener('dragstart', () => {
        dragStartIndex = index;
        li.style.opacity = '0.5';
      });

      li.addEventListener('dragend', () => {
        li.style.opacity = '1';
      });

      li.addEventListener('dragover', e => e.preventDefault());
      li.addEventListener('drop', () => {
        const dragEndIndex = index;
        if (dragStartIndex !== null && dragEndIndex !== dragStartIndex) {
          const moved = qualities.splice(dragStartIndex, 1)[0];
          qualities.splice(dragEndIndex, 0, moved);
          saveAndShow();
        }
      });

      list.appendChild(li);
    });
  }

  function saveAndShow() {
    localStorage.setItem('coolQualities', JSON.stringify(qualities));
    showList();
  }

  addBtn.addEventListener('click', function () {
    const val = select.value.trim();
    if (!val) {
      alert('Select a quality first!');
      return;
    }
    qualities.push(val);
    saveAndShow();
    select.value = '';
  });

  clearBtn.addEventListener('click', function () {
    if (confirm('Clear all cool qualities?')) {
      qualities = [];
      localStorage.removeItem('coolQualities');
      showList();
    }
  });

  showList();
});
