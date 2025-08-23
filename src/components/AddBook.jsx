import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const [formData, setFormData] = useState({
    bookTitle: '',
    authorName: '',
    genre: '',
    isbn: '',
    publisher: '',
    yearPublished: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const genres = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Mystery'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.bookTitle.trim() || !formData.authorName.trim() || 
        !formData.genre || !formData.isbn.trim() || 
        !formData.publisher.trim() || !formData.yearPublished.trim()) {
      return 'All fields are required';
    }
    
    const isbnRegex = /^(?:\d{10}|\d{13})$/;
    if (!isbnRegex.test(formData.isbn.replace(/-/g, ''))) {
      return 'ISBN must be 10 or 13 digits';
    }
    
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.yearPublished);
    if (isNaN(year) || year < 1000 || year > currentYear) {
      return `Please enter a valid year between 1000 and ${currentYear}`;
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log('Submitting book data:', formData);
      
      const response = await fetch('http://localhost:8080/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Book added successfully:', result);
        alert('Book Added Successfully');
        navigate('/viewbooks'); // Navigate to books page
      } else {
        let errorMessage = 'Failed to add book';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData || `Server error: ${response.status}`;
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Cannot connect to server. Please check if backend is running on http://localhost:8080');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Register a New Book</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Book Title</label>
            <input
              type="text"
              name="bookTitle"
              placeholder="Book Title"
              value={formData.bookTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Author Name</label>
            <input
              type="text"
              name="authorName"
              placeholder="Author Name"
              value={formData.authorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="">Select Genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="isbn"
              placeholder="ISBN (10 or 13 digits)"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Publisher</label>
            <input
              type="text"
              name="publisher"
              placeholder="Publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Year Published</label>
            <input
              type="number"
              name="yearPublished"
              placeholder="Year Published"
              min="1000"
              max={new Date().getFullYear()}
              value={formData.yearPublished}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;