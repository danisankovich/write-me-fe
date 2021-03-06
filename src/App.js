import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Tracker from './components/tracker/tracker.jsx';
import Login from './components/login/login.jsx';
import Button from './components/button/button.jsx';
import BookSearch from './components/bookSearch/bookSearch.jsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.scss';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

      if (token) {
        fetch('http://localhost:3001/api/users/current', {
          method: 'GET',
          headers: {'Authorization': `Token ${token}`}
        }).then(res => res.json()).then(response => {
          setUser(response.user)
        })
      }  
  }, [])

  function handleAuth(data) {
    localStorage.setItem('token', data.user.token);
    setUser(data.user);
  }

  function logout() {
    fetch('http://localhost:3001/api/users/logout', {method: 'GET'}).then().then(() => { 
      setUser(null);
      localStorage.removeItem('token');
    })
  }

    return (
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link as={Link} to="/button">Button</Nav.Link>
            <Nav.Link as={Link} to="/book-search">Books</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>

              {user && user.token && <NavDropdown title={user.username} id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to="/tracker">Tracker</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>}
              {user && user.token && <Nav.Link onClick={logout}>Logout</Nav.Link>}
              {!user && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            </Nav>}
          </Navbar.Collapse>
        </Navbar>
        <Container>
          <Switch>
              <Route path="/tracker">
                <Tracker user={user} />
              </Route>
              <Route path="/login">
                <Login handleAuth={handleAuth} />
              </Route>              
              <Route path="/button">
                <Button></Button>
              </Route>
              <Route path="/book-search">
                <BookSearch></BookSearch>
              </Route>
            </Switch>
        </Container>
      </Router>
    );

}

export default App;
