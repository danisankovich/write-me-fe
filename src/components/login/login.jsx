import React, { useState } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import { useHistory } from "react-router-dom";


import './login.scss';

export default function Login(props) {
    const [ currentType, setCurrentType ] = useState('LOGIN');
    const [ email, setEmail ] = useState('');
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const history = useHistory();
    if (localStorage.getItem('token')) {
        history.push('/tracker')
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (currentType === 'SIGNUP') {
            fetch('http://localhost:3001/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: {email, password, username}})
            }).then(res => res.json()).then(response => {
                props.handleAuth(response);
                history.push('/tracker')
            })
        }

        if (currentType === 'LOGIN') {
            fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user: { email, password }})
            }).then(res => res.json()).then(response => {
                props.handleAuth(response);
                history.push('/tracker')
            })
        }
    }

    function handleEmail(e) {
        setEmail(e.target.value);
    }
    
    function handleUsername(e) {
        setUsername(e.target.value);
    }
    function handlePassword(e) {
        setPassword(e.target.value);
    }

    function swapAuth() {
        const newCurrentType = currentType === 'LOGIN' ? 'SIGNUP' : 'LOGIN';
        setCurrentType(newCurrentType)
    }

    return (
        <Row>
            <Form onSubmit={handleSubmit}>
                <Form.Control type="text" placeholder="email" onChange={handleEmail}></Form.Control>
                {currentType === 'SIGNUP' && <Form.Control type="text" placeholder="username" onChange={handleUsername}></Form.Control> }
                <Form.Control type="password" placeholder="password" onChange={handlePassword}></Form.Control>
                <Button type="submit">{currentType}</Button>
                <div>Need an account? Click <a className="link-button" onClick={swapAuth}>here</a></div>
            </Form>
        </Row>
    )
}