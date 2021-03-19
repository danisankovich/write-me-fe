import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

const key = '';

export default function BookSearch() {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('null');

    function handleTitle(e) {
        setTitle(e.target.value);
    }

    function search(e) {
        e.preventDefault();
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=39&key=${key}`).then(res => res.json())
            .then(response => setData(response))
    }

    function bookClickHandle(isbn) {
        history.push(`/book/${isbn}`);
    }

    function renderResults() {
        if (data && data.items) {
            return (
                <div>
                    <ul>
                        {data.items.map(item => {
                            const book = item.volumeInfo;
                            const { title, authors, publishedDate, imageLinks} = book;
                            if (!title || !authors || !publishedDate || !imageLinks) {
                                return null;
                            }
                            const id = item.id;
                            const [year, month, day] = publishedDate.split('-');
                            const publishedDateFOrmatted = `${month}/${day}/${year}`;
                            return (
                                <li key={id} onClick={() => bookClickHandle(book.industryIdentifiers[0].identifier)}>
                                    <div className="title-holder"><span className="title">Title: </span><span>{title}</span></div>
                                    <div className="author-holder"><span className="author">By: </span><span>{authors.join(', ')}</span></div>
                                    <div className="published-holder"><span className="published">Published: </span><span>{publishedDateFOrmatted}</span></div>
                                    <div className="image-holder"><img src={imageLinks.smallThumbnail} alt=""></img></div>
                                </li>
                            )
                        }).filter(Boolean)};
                    </ul>
                </div>
            )
        }
    }

    return (
        <div>
            <Form onSubmit={search}>
                <Form.Control onChange={handleTitle}></Form.Control>
                <Button type="submit">Search</Button>
            </Form>
            {renderResults()}
        </div>
    )
}