import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import Home from '../components/Home';
import { BrowserRouter } from 'react-router-dom';
import AddBook from '../components/AddBook';
import ViewBooks from '../components/ViewBooks';
import Footer from '../components/Footer';


// Helper to set genre reliably
function selectGenre(value = 'Fiction') {
  const genreSelect = screen.getByRole('combobox');
  fireEvent.change(genreSelect, { target: { value } });
  return value;
}

test('renders_App_with_Header_and_routing_links', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const headerTitleElements = screen.getAllByRole('heading', { name: /Neo Library Book Management/i });
  expect(headerTitleElements.length).toBeGreaterThanOrEqual(1);

  const booksLinkElement = screen.getByText(/Books/i);
  expect(booksLinkElement).toBeInTheDocument();
});

test('renders_AddBook_component_form_from_Home', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const addBookLink = screen.getByText(/Add Book/i);
  fireEvent.click(addBookLink);
  const heading = screen.getByText(/Register a New Book/i);
  expect(heading).toBeInTheDocument();
});


test('renders_Home_component_with_Heading', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/Welcome to Neo Library Book Management System/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders_Home_component_image_used_inside_div_home', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const heading = screen.getByText(/Welcome to Neo Library Book Management System/i);
  const imageElement = screen.getByAltText(/Library background/i);
  expect(heading).toBeInTheDocument();
  expect(imageElement).toBeInTheDocument();
});




test('renders_form_input_fields_and_labels', () => {
  render(
    <BrowserRouter>
      <AddBook />
    </BrowserRouter>
  );
  expect(screen.getByPlaceholderText(/Book Title/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Author Name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/ISBN/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Publisher/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Year Published/i)).toBeInTheDocument();
});

test('checks_submit_form_functionality', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({})
  });

  render(
    <BrowserRouter>
      <AddBook />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/Book Title/i), { target: { value: 'Clean Code' } });
  fireEvent.change(screen.getByPlaceholderText(/Author Name/i), { target: { value: 'Robert C. Martin' } });
  fireEvent.change(screen.getByPlaceholderText(/ISBN/i), { target: { value: '9780132350884' } });
  fireEvent.change(screen.getByPlaceholderText(/Publisher/i), { target: { value: 'Prentice Hall' } });
  fireEvent.change(screen.getByPlaceholderText(/Year Published/i), { target: { value: '2008' } });

  selectGenre('Fiction');

  const submitButton = screen.getByText(/Add Book/i);
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalled();
  });

  const fetchArgs = fetchMock.mock.calls[0];
  const requestBody = JSON.parse(fetchArgs[1].body);

  // ✅ Use endsWith for flexible URL check
  expect(fetchArgs[0].endsWith('/addBook')).toBe(true); 
  expect(fetchArgs[1].method).toBe('POST');
  expect(fetchArgs[1].headers['Content-Type']).toBe('application/json');

  expect(requestBody).toEqual({
    bookTitle: 'Clean Code',
    authorName: 'Robert C. Martin',
    isbn: '9780132350884',
    genre: 'Fiction',
    publisher: 'Prentice Hall',
    yearPublished: '2008',
  });

  fetchMock.mockRestore();
});



test('fetches_data_from_the_backend_when_the_component_mounts', async () => {
  const mockBooks = [
    {
      bookTitle: 'The Pragmatic Programmer',
      authorName: 'Andrew Hunt',
      genre: 'Programming',
      isbn: '9780201616224',
      publisher: 'Addison-Wesley',
      yearPublished: '1999',
    }
  ];

  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => mockBooks
  });

  render(
    <BrowserRouter>
      <ViewBooks />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();
    expect(screen.getByText('Andrew Hunt')).toBeInTheDocument();
    expect(screen.getByText('Programming')).toBeInTheDocument();
    expect(screen.getByText('9780201616224')).toBeInTheDocument();
    expect(screen.getByText('Addison-Wesley')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  global.fetch.mockRestore();
});

test('renders_Library_Book_Management_App_in_the_footer', () => {
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
  const footerText = screen.getByText(/2025 Library Book Management App/i);
  expect(footerText).toBeInTheDocument();
});