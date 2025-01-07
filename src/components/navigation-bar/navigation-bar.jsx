import { useState } from "react";

import { Navbar, Container, Nav, Offcanvas, Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./navigation-bar.scss";

export const NavigationBar = ({ user, onLoggedOut }) => {
    const location = useLocation();
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSearch = (event) => {
        event.preventDefault();
        if (searchTerm.trim() === '') return; 
        navigate(`/search/${encodeURIComponent(searchTerm)}`);
        setSearchTerm(""); 
        handleClose();
    };

    return (
        <Navbar expand={false} className="mb-3">
            <Container fluid>
                <Navbar.Brand className="logo" as={Link} to="/">
                    Dojo<span>DB</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={handleShow}></Navbar.Toggle>
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end"
                    show={show}
                    onHide={handleClose}
                    data-bs-theme="dark"
                >
                    <Offcanvas.Header closeButton></Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            {!user && (
                                <>
                                    <Nav.Link as={Link} to="/login" active={location.pathname === "/login"} onClick={handleClose}>
                                        Login
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/signup" active={location.pathname === "/signup"} onClick={handleClose}>
                                        Signup
                                    </Nav.Link>
                                </>
                            )}
                            {user && (
                                <>
                                    <Nav.Link as={Link} to="/" active={location.pathname === "/"} onClick={handleClose} >
                                        <i class="bi bi-house"></i> Home
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/profile" active={location.pathname === "/profile"} onClick={handleClose}>
                                        <i class="bi bi-person"></i> Profile
                                    </Nav.Link>
                                    <Nav.Link onClick={() => { onLoggedOut(); handleClose(); }}>
                                        <i class="bi bi-door-closed"></i> Logout
                                    </Nav.Link>
                                    <Form className="d-flex mt-5" onSubmit={handleSearch}>
                                        <Form.Control
                                            type="search"
                                            placeholder="Search DojoDB"
                                            className="me-2 search-input"
                                            aria-label="Search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        <Button variant="link" className="search-button"><i class="bi bi-search"></i></Button>
                                    </Form> 
                                </>
                            )}
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    )
}
