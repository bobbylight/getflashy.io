import {Navbar, Nav, NavDropdown, Dropdown, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AppNavbar() {
    return (
        <Navbar expand="lg" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <i className="fa fa-bolt" aria-hidden="true"></i> Flashy
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="#">Link</Nav.Link>
                        <Nav.Link as={Link} to="#">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <Dropdown.Item as={Link} to="#">Action</Dropdown.Item>
                            <Dropdown.Item as={Link} to="#">Another action</Dropdown.Item>
                            <Dropdown.Item as={Link} to="#">Something else here</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to="#">Separated link</Dropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
