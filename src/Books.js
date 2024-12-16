import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]); // State to hold books
  const [newBook, setNewBook] = useState({ id: "", title: "", author: "" }); // State for new book
  const [viewAll, setViewAll] = useState(false); // State to control "View All" button

  // Fetch all books from Go backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/books");
      console.log("Books fetched:", response.data); // Debugging log
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

    // Log the request payload
    console.log("Adding book:", newBook);

    // Optimistically update the UI with the new book
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);

    try {
      // Send POST request to add the new book
      await axios.post("http://localhost:8080/api/books", newBook, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Book added successfully:", newBook);
      setNewBook({ id: "", title: "", author: "" }); // Reset form

      // Fetch the updated list of books from the server
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please check the console for details.");

      // Rollback to the previous state if there's an error
      setBooks(books);
    }
  };

  // Delete a book
  const deleteBook = async (id) => {
    try {
      // Send DELETE request to remove the book

      console.log(
        `Sending DELETE request to: http://localhost:8080/api/books/${id}`
      );
      await axios.delete(`http://localhost:8080/api/books/${id}`);

      // Fetch the updated list of books from the server
      fetchBooks();
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

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <><div className="bg"></div><div className="book-container">
      {/* Form Section */}
      <form>
        <input
          type="text"
          placeholder="ID"
          value={newBook.id}
          onChange={(e) => setNewBook({ ...newBook, id: e.target.value })} />
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
        <button onClick={addBook}>Add Book</button>
      </form>

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
                  <button onClick={() => deleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div></>

  );
};

export default Books;
