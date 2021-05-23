class Book {
	constructor(params) {
		this.title = params.title;
		this.author = params.author;
		this.pages = params.pages;
		this.read = params.read;
	}

	readStatus() {
		this.read == true ? false : true;
	} 
}

// Pulls the stored library and makes my Library**************************************** 

let myLibrary = [];
const storedLibrary = localStorage.getItem('myLibrary');
if (storedLibrary) {
	myLibrary = JSON.parse(storedLibrary).map((book) => new Book(book));
}

//**************************************************************************************

const showModalButton = document.querySelector('[data-modal-target]');
const hideModalButton = document.querySelector('[data-close-button]');
const overlay = document.getElementById('overlay');
const popUpModal = document.querySelector('[data-modal]');
const bookForm = document.querySelector('[data-new-book-form]');
const libraryItems = document.querySelector('[data-library-items]');

//Display table of books*****************************************************************
function displayBooks() {
  libraryItems.innerHTML = myLibrary.map((book, index) => `
  <tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td>${book.read ? 'Yes' : 'No'}</td>
      <td></td>
  </tr>`
    ).join('');
}

//Buttons to open and close modal********************************************************
showModalButton.addEventListener('click', () => {
	const modal = document.querySelector(showModalButton.dataset.modalTarget);
	showModal(modal);
});

hideModalButton.addEventListener('click', () => {
	const modal = hideModalButton.closest(".modal");
	hideModal(modal);
});

function showModal(modal) {
	if (modal == null) return;
	modal.classList.add('active');
	overlay.classList.add('active');
}

function hideModal(modal) {
	if (modal == null) return;
	modal.classList.remove('active');
	overlay.classList.remove('active');
}
//Submit Form***************************************************************************
bookForm.addEventListener('submit', newBook);

function newBook(e) {
	e.preventDefault();
	book = new Book({
		title: document.querySelector('[name=title]').value,
		author: document.querySelector('[name=author]').value,
		pages: document.querySelector('[name=pages]').value,
		read: document.querySelector('[name=read]').checked
	})
	addBookToLibrary(book);
	hideModalOnSubmit();
	displayBooks();
	this.reset();
}

function addBookToLibrary(book) {
	myLibrary.push(book);
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function hideModalOnSubmit() {
	popUpModal.classList.remove('active');
	overlay.classList.remove('active');
}
//**************************************************************************************
displayBooks();
