import React from 'react';
import {Navbar, Nav, NavDropdown, Dropdown, Container} from 'react-bootstrap'; // Dropdown.Item for MenuItem
import { Link } from 'react-router-dom'; // For navigation

function AppNavbar() {
    return (
        <Navbar expand="lg" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/"> {/* Use 'as={Link} to="..."' for react-router integration */}
                    <i className="fa fa-bolt" aria-hidden="true"></i> Flashy
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Toggle button */}
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto"> {/* ms-auto for right alignment */}
                        <Nav.Link as={Link} to="#">Link</Nav.Link> {/* Nav.Link replaces NavItem */}
                        <Nav.Link as={Link} to="#">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <Dropdown.Item as={Link} to="#">Action</Dropdown.Item> {/* Dropdown.Item replaces MenuItem */}
                            <Dropdown.Item as={Link} to="#">Another action</Dropdown.Item>
                            <Dropdown.Item as={Link} to="#">Something else here</Dropdown.Item>
                            <Dropdown.Divider /> {/* Dropdown.Divider replaces MenuItem divider */}
                            <Dropdown.Item as={Link} to="#">Separated link</Dropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
