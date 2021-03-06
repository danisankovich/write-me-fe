import React, { Component } from 'react';
import { Row, Form, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";

import './login.scss';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {currentType: 'LOGIN'};
        if (localStorage.getItem('token')) {
            this.setState({redirect: true})
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.currentType === 'SIGNUP') {
            fetch('http://localhost:3001/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({user: {email: this.state.email, password: this.state.password, username: this.state.username}})
            }).then(res => res.json()).then(response => {
                this.props.handleAuth(response);
                this.setState({redirect: true})
                // redirect to profile. remove the login tab, replace with profile and signout
            })
        }

        if (this.state.currentType === 'LOGIN') {
            fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({user: {email: this.state.email, password: this.state.password }})
            }).then(res => res.json()).then(response => {
                this.props.handleAuth(response);
                this.setState({redirect: true})
                // redirect to profile. remove the login tab, replace with profile and signout
            })
        }
    }

    handleInputs(type, e) {
        this.setState({[type]: e.target.value})
    }

    swapAuth() {
        const currentType = this.state.currentType === 'LOGIN' ? 'SIGNUP' : 'LOGIN';
        this.setState({currentType})
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/tracker' />
          }
        return (
            <Row>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Control type="text" placeholder="email" onChange={this.handleInputs.bind(this, 'email')}></Form.Control>
                    {this.state.currentType === 'SIGNUP' && <Form.Control type="text" placeholder="username" onChange={this.handleInputs.bind(this, 'username')}></Form.Control> }
                    <Form.Control type="password" placeholder="password" onChange={this.handleInputs.bind(this, 'password')}></Form.Control>
                    <Button type="submit">{this.state.currentType}</Button>
                    <div>Need an account? Click <a className="link-button" onClick={this.swapAuth.bind(this)}>here</a></div>
                </Form>
            </Row>
        )
    }
}

export default Login;