/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import Link from 'next/link';
import Image from 'next/image';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const pathName = usePathname();
  
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <Image 
            src="/images/club-oven-lovin-logo.png" 
            alt="Toaster Oven Lovin'" 
            width={40} 
            height={40}
            className="me-2"
          />
          <span className="fw-bold" style={{ color: '#1a5f4f' }}>
            Toaster Oven Lovin&apos;
          </span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/" className="mx-2 nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link href="/browse-recipie" className="mx-2 nav-link-custom">
              Recipes
            </Nav.Link>
            <Nav.Link href="/vendors" className="mx-2 nav-link-custom">
              Vendors
            </Nav.Link>
            
            {currentUser && (
              <Nav.Link href="/add-recipe" className="mx-2 nav-link-custom">
                Add Recipe
              </Nav.Link>
            )}
            
            {currentUser && role === 'ADMIN' && (
              <Nav.Link href="/admin" className="mx-2 nav-link-custom">
                Admin
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center">
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser} className="mx-2">
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  {' '}
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href="/auth/signin" className="mx-2 nav-link-custom">
                  Sign In
                </Nav.Link>
                <Link href="/auth/signup" legacyBehavior>
                  <Button
                    style={{
                      backgroundColor: '#ff6b35',
                      borderColor: '#ff6b35',
                      borderRadius: '20px',
                      padding: '8px 24px',
                      marginLeft: '10px'
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
