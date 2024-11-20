import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:5000/books";

function Home() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 15;
  const navigate = useNavigate();

  // Fetch books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(books.length / booksPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Delete book
  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // Edit book
  const editBook = (id) => {
    navigate(`/edit-book/${id}`); // Navigate to the edit page with the book ID
  };

  return (
    <div className="Home">
      <h1>Book Management</h1>
      <button onClick={() => navigate("/add-book")} className="add-button">
        Add Book
      </button>

      <div className="book-list">
        {currentBooks.length === 0 ? (
          <p>No books available. Please add one.</p>
        ) : (
          currentBooks.map((book) => (
            <div key={book._id} className="book">
              <h2>{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>{book.description}</p>
              <div className="action-buttons">
                <button
                  className="edit-button"
                  onClick={() => navigate(`/edit-book/${book._id}`)}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBook(book._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(books.length / booksPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
