package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Book struct
type Book struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Author string `json:"author"`
}

var books []Book

// Middleware to enable CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow all origins for development. Change '*' to specific origin (e.g., "http://localhost:3000") for production.
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000") // Use "*" for development or specify your React app URL
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization") // Add any custom headers if needed
		w.Header().Set("Access-Control-Allow-Credentials", "true")                    // Optional, if using credentials (cookies/sessions)

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Continue with the request
		next.ServeHTTP(w, r)
	})
}

// Get all books
func getBooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

// Create a new book
func createBook(w http.ResponseWriter, r *http.Request) {
	log.Println("POST request received")
	w.Header().Set("Content-Type", "application/json")
	var book Book
	if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	books = append(books, book)
	log.Printf("Book added: %+v", book)
	json.NewEncoder(w).Encode(book)
}

// Delete a book by ID
func deleteBook(w http.ResponseWriter, r *http.Request) {
	log.Println("DELETE request received")
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	log.Printf("Deleting book with ID: %s", params["id"])
	for index, item := range books {
		if item.ID == params["id"] {
			books = append(books[:index], books[index+1:]...)
			json.NewEncoder(w).Encode(books)
			return
		}
	}
	http.Error(w, "Book not found", http.StatusNotFound)
}

func main() {
	// Initialize with sample data
	books = append(books, Book{ID: "1", Title: "Titans", Author: "JP"})

	// Create Router
	router := mux.NewRouter()

	// Apply CORS middleware to the router
	router.Use(enableCORS)

	// Define Routes
	router.HandleFunc("/api/books", getBooks).Methods("GET")
	router.HandleFunc("/api/books", createBook).Methods("POST", "OPTIONS")
	router.HandleFunc("/api/books/{id}", deleteBook).Methods("DELETE", "OPTIONS")

	// Start the Server
	port := ":8080"
	fmt.Println("Server started on port", port)
	log.Fatal(http.ListenAndServe(port, router))
}
