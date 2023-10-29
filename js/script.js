const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF';
const SAVED_EVENT = 'saved-book';
const MOVED_EVENT = 'moved-book';
const DELETED_EVENT = 'deleted-book';

const books = [];

const isStorageIsExist = () => {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung web storage');
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedBook = document.getElementById('uncompleted');
  uncompletedBook.innerHTML = '';

  const iscompletedBook = document.getElementById('iscompleted');
  iscompletedBook.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBookElement(bookItem);
    if (bookItem.isComplete) {
      iscompletedBook.append(bookElement);
    } else {
      uncompletedBook.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, () => {
  const elementAlert = document.createElement('div');
  elementAlert.classList.add('alert');
  elementAlert.innerHTML = 'Buku berhasil disimpan';

  document.body.insertBefore(elementAlert, document.body.children[0]);
  setTimeout(() => {
    elementAlert.remove();
  }, 3000);
});

document.addEventListener(MOVED_EVENT, () => {
  const elementAlert = document.createElement('div');
  elementAlert.classList.add('alert');
  elementAlert.innerHTML = 'Buku berhasil dipindah';

  document.body.insertBefore(elementAlert, document.body.children[0]);
  setTimeout(() => {
    elementAlert.remove();
  }, 3000);
});

document.addEventListener(DELETED_EVENT, () => {
  const elementAlert = document.createElement('div');
  elementAlert.classList.add('alert');
  elementAlert.innerHTML = 'Buku berhasil dihapus';

  document.body.insertBefore(elementAlert, document.body.children[0]);
  setTimeout(() => {
    elementAlert.remove();
  }, 3000);
});

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data !== null) {
    for (const item of data) {
      books.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageIsExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const moveData = () => {
  if (isStorageIsExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
};

const deleteData = () => {
  if (isStorageIsExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
  }
};

const addBook = () => {
  const bookTitle = document.getElementById('judul');
  const bookAuthor = document.getElementById('penulis');
  const bookYear = document.getElementById('tahun');
  const bookHasFinished = document.getElementById('selesaiDibaca');
  let bookStatus;

  bookHasFinished.checked ? (bookStatus = true) : (bookStatus = false);

  books.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookAuthor.value = null;
  bookYear.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const makeBookElement = (bookObject) => {
  const elementBookTitle = document.createElement('p');
  elementBookTitle.classList.add('item-title');
  elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;

  const elementBookAuthor = document.createElement('p');
  elementBookAuthor.classList.add('item-author');
  elementBookAuthor.innerHTML = bookObject.author;

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('item-info');
  infoContainer.append(elementBookTitle, elementBookAuthor);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('item-action');

  const elementContainer = document.createElement('div');
  elementContainer.classList.add('item');
  elementContainer.append(infoContainer);
  elementContainer.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const btnUndo = document.createElement('button');
    btnUndo.classList.add('btn-undo');
    btnUndo.innerHTML = `<i class="bx bx-undo" />`;

    btnUndo.addEventListener('click', () => {
      finishedBook(bookObject.id);
    });

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete');
    btnDelete.innerHTML = `<i class="bx bx-trash" />`;

    btnDelete.addEventListener('click', () => {
      deletedBook(bookObject.id);
    });

    actionContainer.append(btnUndo, btnDelete);
    infoContainer.append(actionContainer);
  } else {
    const btnFinish = document.createElement('button');
    btnFinish.classList.add('btn-finish');
    btnFinish.innerHTML = `<i class="bx bx-check" />`;

    btnFinish.addEventListener('click', () => {
      addBookToFinished(bookObject.id);
    });

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete');
    btnDelete.innerHTML = `<i class="bx bx-trash" />`;

    btnDelete.addEventListener('click', () => {
      deletedBook(bookObject.id);
    });

    actionContainer.append(btnFinish, btnDelete);
    infoContainer.append(actionContainer);
  }

  return elementContainer;
};

const addBookToFinished = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const finishedBook = (bookId) => {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const deletedBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
};

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) return bookItem;
  }

  return -1;
};

const findBookIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) return index;
  }

  return -1;
};

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageIsExist()) loadDataFromStorage();

  const simpanForm = document.getElementById('formDataBuku');
  simpanForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('search-book');
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchBook();
  });
});

const searchBook = () => {
  const searchInput = document.getElementById('cariBuku').value.toLowerCase();
  const bookItems = document.getElementsByClassName('item');

  for (let i = 0; i < bookItems.length; i++) {
    const itemTitle = bookItems[i].querySelector('.item-title');
    if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove('hidden');
    } else {
      bookItems[i].classList.add('hidden');
    }
  }
};
