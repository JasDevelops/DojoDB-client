import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./navigation-bar.scss";

export const NavigationBar = ({ user, onLoggedOut }) => {
    const location = useLocation();
    return (
        <Navbar expand="md">
            <Container>
                <Navbar.Brand className="logo" as={Link} to="/">
                    DojoDB 
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" >
                <i class="bi bi-list"></i>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!user && (
                            <>
                                <Nav.Link as={Link} to="/login" active={location.pathname === "/login"} >
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/signup" active={location.pathname === "/signup"} >
                                    Signup
                                </Nav.Link>
                            </>
                        )}
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/" active={location.pathname === "/"} >
                                Home
                                </Nav.Link>
                                <Nav.Link as={Link} to="/profile" active={location.pathname === "/profile"} >
                                    Profile
                                </Nav.Link>
                                <Nav.Link onClick={onLoggedOut}>
                                    Logout
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};