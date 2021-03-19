import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";

const key = '';

export default function Book(props) {
    const { id } = useParams();
    const [ book, setBook ] = useState(null)
   
    useEffect(() => {
        fetch(`https://books.googleapis.com/books/v1/volumes?q=isbn:${id}&key=${key}`).then(res => res.json()).then(response => {
            setBook(response);
        })
    }, [])

    function renderBook() {
        if (book) {
            return (
                <div>
                    {book.items[0].volumeInfo.title}
                </div>
            )
        }
        return <div>Loading...</div>

    }

    return (
        <div>{renderBook()}</div>
    )
}