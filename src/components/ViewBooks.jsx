import React, { useState, useEffect } from 'react';
import '../App.css';

const ViewBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchBooks = async () => {
    try {
        const response = await fetch('http://localhost:8080/getAllBooks', {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    fetchBooks();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: [Error - You need to specify the message]</div>;

  return (
    <div className="view-books-container">
      <h2>All Books</h2>
      {books.length > 0 ? (
        <table className="books-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author Name</th>
              <th>Genre</th>
              <th>ISBN</th>
              <th>Publisher</th>
              <th>Year Published</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookId}>
                <td>{book.bookTitle}</td>
                <td>{book.authorName}</td>
                <td>{book.genre}</td>
                <td>{book.isbn}</td>
                <td>{book.publisher}</td>
                <td>{book.yearPublished}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-books">No books available</p>
      )}
    </div>
  );
};

export default ViewBooks;