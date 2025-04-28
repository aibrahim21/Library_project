function Author(name, email) {
    this.name = name;
    this.email = email;
  }

  function Book(name, price, author) {
    this.name = name;
    this.price = price;
    this.author = author;
  }

  let booksArray = [];

  function createBookForm() {
    const numBooks = document.getElementById('numBooks').value;
    const bookFormContainer = document.getElementById('bookFormContainer');
    bookFormContainer.innerHTML = '';

    if (numBooks && numBooks > 0) {
      for (let i = 0; i < numBooks; i++) {
        const form = document.createElement('form');
        form.setAttribute('id', `bookForm${i}`);

        form.innerHTML += `<label for="bookName${i}">Book Name:</label><input type="text" id="bookName${i}" required><br>`;
        form.innerHTML += `<label for="bookPrice${i}">Price:</label><input type="number" id="bookPrice${i}" required><br>`;
        form.innerHTML += `<label for="authorName${i}">Author Name:</label><input type="text" id="authorName${i}" required><br>`;
        form.innerHTML += `<label for="authorEmail${i}">Author Email:</label><input type="email" id="authorEmail${i}" required><br>`;
        form.innerHTML += `<button type="button" onclick="addBook(${i})">Add Book</button>`;

        bookFormContainer.appendChild(form);
      }
    } else {
      alert('Please enter a valid number of books.');
    }
  }

  function addBook(index) {
    const bookName = document.getElementById(`bookName${index}`).value;
    const bookPrice = document.getElementById(`bookPrice${index}`).value;
    const authorName = document.getElementById(`authorName${index}`).value;
    const authorEmail = document.getElementById(`authorEmail${index}`).value;

    if (!bookName || !bookPrice || !authorName || !authorEmail) {
      alert('Please fill in all fields');
      return;
    }

    const author = new Author(authorName, authorEmail);
    const book = new Book(bookName, bookPrice, author);

    booksArray.push(book);
    displayBooks();
    document.getElementById(`bookForm${index}`).reset();
  }

  function displayBooks() {
    const tableBody = document.querySelector('#bookTable tbody');
    tableBody.innerHTML = '';

    booksArray.forEach(function(book, index) {
      const row = document.createElement('tr');
      row.setAttribute('id', `bookRow${index}`);

      row.innerHTML = `
        <td>${book.name}</td>
        <td>${book.price}</td>
        <td>${book.author.name}</td>
        <td>${book.author.email}</td>
        <td>
          <button onclick="editBook(${index})">Edit</button>
          <button onclick="deleteBook(${index})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  function editBook(index) {
    const book = booksArray[index];
    const row = document.getElementById(`bookRow${index}`);
    const cells = row.getElementsByTagName('td');

    for (let i = 0; i < 4; i++) {
      cells[i].contentEditable = true;
    }

    const editButton = cells[4].querySelector('button');
    editButton.textContent = 'Save';
    editButton.onclick = function() { saveBook(index); };

    const deleteButton = cells[4].querySelectorAll('button')[1];
    deleteButton.textContent = 'Cancel';
    deleteButton.onclick = function() { cancelEdit(index); };
  }

  function saveBook(index) {
    const row = document.getElementById(`bookRow${index}`);
    const cells = row.getElementsByTagName('td');

    booksArray[index].name = cells[0].textContent;
    booksArray[index].price = cells[1].textContent;
    booksArray[index].author.name = cells[2].textContent;
    booksArray[index].author.email = cells[3].textContent;

    displayBooks();
  }

  function cancelEdit(index) {
    displayBooks();
  }

  function deleteBook(index) {
    booksArray.splice(index, 1);
    displayBooks();
  }