import React, { useState, useEffect } from "react";
const key = '';

export default function BookSearch() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`https://www.googleapis.com/books/v1/volumes?q=Mistborn&maxResults=39&keyes&key=${key}`).then(res => res.json())
            .then(data => setData(data))
    }, []); // without this, useEffect runs on every state or prop change (as we do here). When empty, it runs only once. the array holds dependencies that determines when to rerun.

    return (
        <div>
            <ul>
                hello
            </ul>
        </div>
    )
}