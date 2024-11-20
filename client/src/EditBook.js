import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:5000/books";

function EditBook() {
  const [form, setForm] = useState({ title: "", author: "", description: "" });
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const { id } = useParams(); // Get the book ID from the route

  // Fetch book details when the component mounts
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        if (response.data) {
          setForm(response.data); // Populate form with existing data
        } else {
          setError("Book not found");
          setForm({ title: "", author: "", description: "" }); // Clear form if no data
        }
        setIsLoading(false); // Turn off loading
      } catch (error) {
        setError("Error fetching book details");
        setForm({ title: "", author: "", description: "" }); // Clear form on error
        setIsLoading(false); // Turn off loading
      }
    };
    fetchBook();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/${id}`, form); // Update the book details on backend
      if (response.status === 200) {
        navigate("/"); // Redirect to home page after updating
      }
    } catch (error) {
      setError("Error updating book details");
      console.error("Error updating book:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="AddBook">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="AddBook">
      <h1>Edit Book</h1>
      {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <div className="action-buttons">
          <button type="submit" className="edit-button">
            Update Book
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBook;
