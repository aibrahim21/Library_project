// ============================================
// Object Constructors
// ============================================

function Author(name, email) {
    this.name = name;
    this.email = email;
}

function Book(name, price, author) {
    this.name = name;
    this.price = parseFloat(price); // Store as number
    this.author = author;
}

// ============================================
// State Management
// ============================================

let booksArray = [];
let editIndex = null; // Track which row is being edited

// ============================================
// DOM References
// ============================================

const bookTableBody = document.getElementById('bookTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const addBookForm = document.getElementById('addBookForm');

// Analytics elements
const totalBooksEl = document.getElementById('totalBooks');
const averagePriceEl = document.getElementById('averagePrice');
const mostExpensiveEl = document.getElementById('mostExpensive');
const totalValueEl = document.getElementById('totalValue');

// ============================================
// Main Functions
// ============================================

// Add a new book from the form
function addBook(event) {
    event.preventDefault(); // Prevent form submission reload

    // Get form values
    const bookName = document.getElementById('bookName').value.trim();
    const bookPrice = document.getElementById('bookPrice').value.trim();
    const authorName = document.getElementById('authorName').value.trim();
    const authorEmail = document.getElementById('authorEmail').value.trim();

    // Validate input
    if (!bookName || !bookPrice || !authorName || !authorEmail) {
        alert('Please fill in all fields.');
        return;
    }

    if (isNaN(bookPrice) || parseFloat(bookPrice) < 0) {
        alert('Please enter a valid price.');
        return;
    }

    // Create new book object
    const author = new Author(authorName, authorEmail);
    const book = new Book(bookName, bookPrice, author);

    booksArray.push(book);
    displayBooks();
    updateAnalytics();
    addBookForm.reset();
}

// Display all books in the table
function displayBooks() {
    bookTableBody.innerHTML = '';

    if (booksArray.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    booksArray.forEach((book, index) => {
        const row = document.createElement('tr');
        row.id = `bookRow${index}`;

        row.innerHTML = `
            <td class="book-name">${escapeHTML(book.name)}</td>
            <td class="book-price">$${book.price.toFixed(2)}</td>
            <td class="author-name">${escapeHTML(book.author.name)}</td>
            <td class="author-email">${escapeHTML(book.author.email)}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editBook(${index})">✏️ Edit</button>
                <button class="btn btn-delete" onclick="deleteBook(${index})">🗑️ Delete</button>
            </td>
        `;

        bookTableBody.appendChild(row);
    });
}

// Edit a book (make row editable)
function editBook(index) {
    // If another row is being edited, save it first
    if (editIndex !== null && editIndex !== index) {
        saveBook(editIndex);
    }

    const row = document.getElementById(`bookRow${index}`);
    const cells = row.querySelectorAll('td:not(:last-child)'); // All except actions

    // Make cells editable
    cells.forEach(cell => {
        cell.contentEditable = true;
        cell.style.backgroundColor = '#fff8e7';
        cell.style.border = '1px dashed #ff9800';
    });

    // Change Edit button to Save
    const actionsCell = row.querySelector('.actions');
    actionsCell.innerHTML = `
        <button class="btn btn-save" onclick="saveBook(${index})">💾 Save</button>
        <button class="btn btn-cancel" onclick="cancelEdit(${index})">❌ Cancel</button>
    `;

    editIndex = index;
}

// Save the edited book
function saveBook(index) {
    const row = document.getElementById(`bookRow${index}`);
    const cells = row.querySelectorAll('td:not(:last-child)');

    // Get new values
    const newName = cells[0].textContent.trim();
    const newPrice = parseFloat(cells[1].textContent.replace('$', '').trim());
    const newAuthorName = cells[2].textContent.trim();
    const newAuthorEmail = cells[3].textContent.trim();

    // Validate
    if (!newName || !newAuthorName || !newAuthorEmail) {
        alert('Book name, author name, and email cannot be empty.');
        return;
    }

    if (isNaN(newPrice) || newPrice < 0) {
        alert('Please enter a valid price.');
        return;
    }

    // Update book object
    booksArray[index].name = newName;
    booksArray[index].price = newPrice;
    booksArray[index].author.name = newAuthorName;
    booksArray[index].author.email = newAuthorEmail;

    editIndex = null;
    displayBooks();
    updateAnalytics();
}

// Cancel editing
function cancelEdit(index) {
    editIndex = null;
    displayBooks();
}

// Delete a book
function deleteBook(index) {
    if (confirm(`Are you sure you want to delete "${booksArray[index].name}"?`)) {
        booksArray.splice(index, 1);
        editIndex = null;
        displayBooks();
        updateAnalytics();
    }
}

// ============================================
// Analytics Dashboard
// ============================================

function updateAnalytics() {
    const totalBooks = booksArray.length;
    totalBooksEl.textContent = totalBooks;

    if (totalBooks === 0) {
        averagePriceEl.textContent = '$0.00';
        mostExpensiveEl.textContent = '$0.00';
        totalValueEl.textContent = '$0.00';
        return;
    }

    const prices = booksArray.map(book => book.price);
    const sum = prices.reduce((acc, price) => acc + price, 0);
    const average = sum / totalBooks;
    const maxPrice = Math.max(...prices);
    const totalValue = sum;

    averagePriceEl.textContent = `$${average.toFixed(2)}`;
    mostExpensiveEl.textContent = `$${maxPrice.toFixed(2)}`;
    totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
}

// ============================================
// Utility Functions
// ============================================

// Simple XSS prevention
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================
// Event Listeners
// ============================================

addBookForm.addEventListener('submit', addBook);

// ============================================
// Initialize
// ============================================

displayBooks();
updateAnalytics();

// Seed with sample data for demonstration (optional)
// Uncomment to add sample books when the page loads
/*
function seedSampleBooks() {
    const sampleBooks = [
        { name: 'The Great Gatsby', price: 12.99, author: 'F. Scott Fitzgerald', email: 'fitz@example.com' },
        { name: '1984', price: 14.99, author: 'George Orwell', email: 'orwell@example.com' },
        { name: 'To Kill a Mockingbird', price: 10.99, author: 'Harper Lee', email: 'lee@example.com' }
    ];
    sampleBooks.forEach(b => {
        const author = new Author(b.author, b.email);
        const book = new Book(b.name, b.price, author);
        booksArray.push(book);
    });
    displayBooks();
    updateAnalytics();
}
// seedSampleBooks();
*/
