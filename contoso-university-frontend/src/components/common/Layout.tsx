import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold">
              <i className="fas fa-graduation-cap me-2"></i>
              Contoso University
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link className={isActive('/') && location.pathname === '/' ? 'active' : ''}>
                  <i className="fas fa-home me-1"></i>
                  Home
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/students">
                <Nav.Link className={isActive('/students') ? 'active' : ''}>
                  <i className="fas fa-user-graduate me-1"></i>
                  Students
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/instructors">
                <Nav.Link className={isActive('/instructors') ? 'active' : ''}>
                  <i className="fas fa-chalkboard-teacher me-1"></i>
                  Instructors
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/courses">
                <Nav.Link className={isActive('/courses') ? 'active' : ''}>
                  <i className="fas fa-book me-1"></i>
                  Courses
                </Nav.Link>
              </LinkContainer>
              
              <LinkContainer to="/departments">
                <Nav.Link className={isActive('/departments') ? 'active' : ''}>
                  <i className="fas fa-building me-1"></i>
                  Departments
                </Nav.Link>
              </LinkContainer>
            </Nav>
            
            <Nav>
              <LinkContainer to="/about">
                <Nav.Link className={isActive('/about') ? 'active' : ''}>
                  <i className="fas fa-info-circle me-1"></i>
                  About
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1 py-4">
        <Container>
          {children}
        </Container>
      </main>

      <footer className="bg-light py-3 mt-auto">
        <Container>
          <div className="row">
            <div className="col-md-6">
              <p className="mb-0 text-muted">
                © 2024 Contoso University. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0 text-muted">
                Built with React & .NET 8
              </p>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;