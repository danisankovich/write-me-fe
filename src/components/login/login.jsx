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

    function handleInput(e, type) {
        switch(type) {
            case('EMAIL'):
                setEmail(e.target.value);
                break;
            case('USERNAME'):
                setUsername(e.target.value);
                break;
            case('PASSWORD'):
                setPassword(e.target.value);
                break;
            default:
                break;
        }
    }

    function swapAuth(e) {
        e.preventDefault();
        const newCurrentType = currentType === 'LOGIN' ? 'SIGNUP' : 'LOGIN';
        setCurrentType(newCurrentType)
    }

    return (
        <Row>
            <Form onSubmit={handleSubmit}>
                <Form.Control type="text" placeholder="email" onChange={(e) => handleInput(e, 'EMAIL')}></Form.Control>
                {currentType === 'SIGNUP' && <Form.Control type="text" placeholder="username" onChange={(e) => handleInput(e, 'USERNAME')}></Form.Control> }
                <Form.Control type="password" placeholder="password" onChange={(e) => handleInput(e, 'PASSWORD')}></Form.Control>
                <Button type="submit">{currentType}</Button>
                <div>Need an account? Click <a href="/" className="link-button" onClick={(e) => swapAuth(e)}>here</a></div>
            </Form>
        </Row>
    )
}