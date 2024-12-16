import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]); // State to hold books
  const [newBook, setNewBook] = useState({ id: "", title: "", author: "" }); // State for new book
  const [editBook, setEditBook] = useState({ id: "", title: "", author: "" }); // State for book being edited
  const [viewAll, setViewAll] = useState(false); // State to control "View All" button

  // Fetch all books from Go backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books.");
    }
  };

  // Add a new book
  const addBook = async () => {
    if (!newBook.id || !newBook.title || !newBook.author) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/books", newBook, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setNewBook({ id: "", title: "", author: "" }); // Reset form
      fetchBooks(); // Fetch the updated list of books
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book.");
    }
  };

  // Update an existing book
  const updateBook = async () => {
    if (!editBook.id || !editBook.title || !editBook.author) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/books/${editBook.id}`, editBook, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setEditBook({ id: "", title: "", author: "" }); // Reset edit form
      fetchBooks(); // Fetch the updated list of books
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book.");
    }
  };

  // Delete a book
  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`);
      fetchBooks(); // Fetch the updated list of books
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book.");
    }
  };

  // Handle View All Books
  const handleViewAll = () => {
    setViewAll(true); // Set to true to show all books
    fetchBooks(); // Fetch books from the server
  };

  // Set the book to be edited
  const handleEdit = (book) => {
    setEditBook(book); // Populate the edit form with the selected book
  };

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <div className="bg"></div>
      <div className="book-container">
        {/* Add Book Form */}
        <form>
          <input
            type="text"
            placeholder="ID"
            value={newBook.id}
            onChange={(e) => setNewBook({ ...newBook, id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
          <button type="button" onClick={addBook}>Add Book</button>
        </form>

        {/* Update Book Form (Only visible when editing a book) */}
        {editBook.id && (
          <div>
            <h3>Update Book</h3>
            <form>
              <input
                type="text"
                placeholder="ID"
                value={editBook.id}
                readOnly 
              />
              <input
                type="text"
                placeholder="Title"
                value={editBook.title}
                onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Author"
                value={editBook.author}
                onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
              />
              <button type="button" onClick={updateBook}>Update Book</button>
            </form>
          </div>
        )}

        {/* View All Button */}
        <div className="view-all">
          <button onClick={handleViewAll}>View All Books</button>
        </div>

        {/* Table for Books */}
        {viewAll && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <button onClick={() => handleEdit(book)}>Edit</button>
                    <button onClick={() => deleteBook(book.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Books;
