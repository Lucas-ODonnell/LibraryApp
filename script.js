class Book {
	constructor(params) {
		this.title = params.title;
		this.author = params.author;
		this.pages = params.pages;
		this.read = params.read;
	}

	changeStatus() {
		this.read = !this.read;
	}
}

// Pulls the stored library and makes my Library**************************************** 

let myLibrary = [];
const storedLibrary = localStorage.getItem('myLibrary');
if (storedLibrary) {
	myLibrary = JSON.parse(storedLibrary).map((book) => new Book(book));
}

//**************************************************************************************
//[0]
const popUpModal = document.querySelector('[data-modal]');
const bookForm = document.querySelector('[data-new-book-form]');
const libraryItems = document.querySelector('[data-library-items]');
//[1]
const sortByPage = document.querySelector('[data-page-sort]');
const sortByRead = document.querySelector('[data-read-sort]');
const sortByAuthor = document.querySelector('[data-author-sort]');
const sortByTitle = document.querySelector('[data-title-sort]');
const reverseAll = document.querySelector('[data-reverse-all]');
//[2]
const showModalButton = document.querySelector('[data-modal-target]');
const hideModalButton = document.querySelector('[data-close-button]');
const overlay = document.getElementById('overlay');
//form-inputs
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const pagesInput = document.getElementById('pages');


//Display table of books[0]*****************************************************************
function displayBooks() {
	libraryItems.innerHTML = myLibrary.map((book, index) => `
  <tr>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      <td>${book.read ? `<button data-check-target="${index}" class="is-change">Yes</button>` : `<button data-check-target="${index}" class="is-change">No</button>`}</td>
      <td><button data-delete-target="${index}" class="is-danger">Delete</button></td>
  </tr>`
	).join('');
}

libraryItems.addEventListener('click', changeStatus);
libraryItems.addEventListener('click', deleteBook);

function changeStatus(e) {
	if (!e.target.matches('.is-change')) return;
	const index = e.target.dataset.checkTarget;
	myLibrary[index].changeStatus();
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	displayBooks();
}

function deleteBook(e) {
	if (!e.target.matches('.is-danger')) return;
	myLibrary.splice(e.target.dataset.deleteTarget, 1); //The 1 means starting at target delete 1
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	displayBooks();
}

//sorting methods[1]****************************************************************************
sortByPage.addEventListener('click', sortPages);
sortByRead.addEventListener('click', sortRead);
sortByAuthor.addEventListener('click', sortAuthor);
sortByTitle.addEventListener('click', sortTitle);
reverseAll.addEventListener('click', reverseTheOrder);

function sortPages(e) {
	e.preventDefault();
	myLibrary = myLibrary.sort(function(a,b) {
		return parseFloat(a.pages) < parseFloat(b.pages) ? -1 : 1;
	});
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	reverseTriangle();
	displayBooks();
}

function sortRead(e) {
	e.preventDefault();
	myLibrary = myLibrary.sort(function(a,b) {
		return a.read > b.read ? -1 : 1;
	});

	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	reverseTriangle();
	displayBooks();
}

function sortAuthor(e) {
	e.preventDefault();
	myLibrary = myLibrary.sort(function(a,b) {
		let aArray = a.author.split(" ");
		let bArray = b.author.split(" ");
		return aArray[aArray.length-1].localeCompare(bArray[bArray.length-1], 'en')
	})
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	reverseTriangle()
	displayBooks();
}

function sortTitle(e) {
	e.preventDefault();
	myLibrary = myLibrary.sort(function(a,b) {
		return a.title.split(" ")[0].localeCompare(b.title.split(" ")[0], 'en')
	})
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	reverseTriangle();
	displayBooks();
}

function reverseTheOrder(e) {
	e.preventDefault();
	let tempLibrary = [];
	for (let i = myLibrary.length-1; i >= 0; i--) {
		tempLibrary.push(myLibrary[i]);
	}
	myLibrary = tempLibrary;
	localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
	reverseAll.innerText == "▴" ? reverseAll.innerText = "▾" : reverseAll.innerText = "▴" 
	displayBooks();
}

function reverseTriangle() {
	reverseAll.innerText = "▴"; 
}

//Buttons to open and close modal[2]********************************************************
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
	if (validateForm()) {
		const book = new Book({
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
//Form Validation

const validateForm = () => {
	const titleValue = titleInput.value.trim();
	const authorValue = authorInput.value.trim();
	const pagesValue = pagesInput.value.trim();
	if (
		validatesTitle(titleValue) 
		&& validatesAuthor(authorValue) 
		&& validatesPages(pagesValue)
	) {
		resetFormInput(titleInput, authorInput, pagesInput);
		return true;
	}
}

const validatesTitle = (titleValue) => {
	if (inputIsEmpty(titleValue)) {
		showError(titleInput, "A book needs a title!");
		return false;
	} else {
		showSuccess(titleInput);
		return true;
	}
}

const validatesAuthor = (authorValue) => {
	if (inputIsEmpty(authorValue)) {
		showError(authorInput, "Author cannot be blank!");
		return false;
	} else {
		showSuccess(authorInput);
		return true;
	}
}

const validatesPages = (pagesValue) => {
	if (notANumber(pagesValue)) {
		showError(pagesInput, "Pages must be a number!");
		return false;
	} else if (inputIsEmpty(pagesValue)) {
		showError(pagesInput, "Pages cannot be blank!");
		return false;
	} else {
		showSuccess(pagesInput);
		return true;
	}
}

const inputIsEmpty = (input) => {
	if (input === "") return true;
} 

const notANumber = (input) => {
	return isNaN(input);
}

const showError = (input, message) => {
	const formControl = input.parentElement; 
	const small = formControl.querySelector('small');
	small.innerText = message;
	formControl.className = 'form-control error';
}

const showSuccess = (input) => {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}

const resetFormInput = (title, author, pages) => {
	const titleFormControl = title.parentElement;
	const authorFormControl = author.parentElement;
	const pagesFormControl = pages.parentElement;
	titleFormControl.className = "form-control";
	authorFormControl.className = "form-control";
	pagesFormControl.className = "form-control";
}


displayBooks();
