import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchUI from "./SearchUI"
import { MainUI } from "./MainUI"
import { Route } from 'react-router-dom'


class BooksApp extends React.Component {
    state = {
        booksOnShelves: [],
        shelves: {
            "currentlyReading": "Currently Reading",
            "wantToRead": "Want To Read",
            "read": "Read"
        },
        booksMatchQuery: [],
        query: ""
    }

    componentDidMount() {
        BooksAPI.getAll().then(
            books => this.setState({booksOnShelves: books})
        ).catch (
            e => console.log(e)
        )
    }

    bookShelfChanger = (bookId, shelf) => {
        let bookOnShelf = this.findBookOnShelf(bookId)
        if (this.isValid(bookOnShelf)){
            this.updateBookOnShelf(bookOnShelf, shelf);
        }

        let bookInSearch = this.findBookAmongSearchResult(bookId)
        if (this.isValid(bookInSearch)){
            this.updateBookAmongSearchResult(bookInSearch,shelf);
            if (!this.isValid(bookOnShelf)) this.putNewBookOnShelf(bookInSearch);
        }
        
        let book = this.isValid(bookOnShelf) ? bookOnShelf : bookInSearch;
        BooksAPI.update(book, shelf);
    }

    findBookOnShelf = (bookId) => {
        return this.state.booksOnShelves.find( el => el.id === bookId );
    }

    findBookAmongSearchResult = (bookId) => {
        return this.state.booksMatchQuery.find( el => el.id === bookId );
    }

    putNewBookOnShelf = (book) => {
        book = this.isValid(book) ? book : [];
        this.setState( state => ({ booksOnShelves: state.booksOnShelves.concat([ book ]) }))
    }

    updateBookOnShelf = (book, shelf) => {
        book.shelf = shelf;
        this.setState( state => ({
            booksOnShelves: state.booksOnShelves.map( el => el.id === book.id ? book : el ) } ))
    }

    updateBookAmongSearchResult = (book, shelf) => {
        book.shelf = shelf;
        this.setState( state => ({
            booksMatchQuery: state.booksMatchQuery.map( el => el.id === book.id ? book : el ) } ))
    }

    isValid = (object) => {
        return (!!object);
    }

    
    updateQuery = (query) => {
        if (this.isValid(query)) {
            this.setState({query});
            this.findBooksUsingBookAPI(query);
        } else { 
            this.clearQuery();
        }
    }

    findBooksUsingBookAPI = (query) => {
        BooksAPI.search(query).then( 
            books => {
                this.setState({booksMatchQuery: this.checkAgainstBooksOnShelf(books)});
            }
        ).catch(e => console.log(e));
    }

    checkAgainstBooksOnShelf = (books) => {
        return (!this.isValid(books)) ? [] : 
            books.map( book => {
                let b = this.findBookOnShelf(book.id);
                return this.isValid(b) ? b : book;
            });
    }
    
    clearQuery = () => {
        this.setState({ query: "", booksMatchQuery: [] })
    }

    render() {
        return (
            <div className="app">
                <Route exact path='/' render={() => (
                    <MainUI 
                        shelves={this.state.shelves} 
                        books={this.state.booksOnShelves} 
                        bookShelfChanger={this.bookShelfChanger}
                        isValid={this.isValid}
                    />
                )} />

                <Route path='/search' render={ ({ history }) => (
                    <SearchUI 
                        query={this.state.query}
                        books={this.state.booksMatchQuery}
                        updateQuery={this.updateQuery}
                        clearQuery={this.clearQuery}
                        shelves={this.state.shelves} 
                        bookShelfChanger={this.bookShelfChanger}
                        isValid={this.isValid}
                    />
                )}/>
            </div>
        )
    }

}

export default BooksApp
