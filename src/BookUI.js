import React from 'react'
// import * as BooksAPI from './BooksAPI'
import './App.css'

const BookShelfChangerUI = (bookId, shelf, bookShelfChanger) => (
    <select id="BookShelfSelector" value={shelf} onChange={event => bookShelfChanger(bookId, event.target.value)}>
        <option value="none" disabled>Move to...</option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
    </select>
)


const display = (book, bookShelfChanger) => (
    <div className="book">
        <div className="book-top">
            <div className="book-cover" style={{
                width: 128,
                height: 193,
                backgroundImage: `url(${book.imageLinks.thumbnail})`
            }}></div>
            <div className="book-shelf-changer">
                {BookShelfChangerUI(book.id, book.shelf, bookShelfChanger)}
            </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">{book.authors ? book.authors.toString() : null}</div>
    </div>
)


export const BookUI = (props) => {

    return (
        props.book ? display(props.book, props.bookShelfChanger) : null 
    )

}