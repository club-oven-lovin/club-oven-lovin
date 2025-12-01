/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight, Lock } from 'react-bootstrap-icons';
import Link from 'next/link';
import Image from 'next/image';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const userWithRole = session?.user as { email: string; randomKey: string };
  const role = userWithRole?.randomKey;
  const homeHref = currentUser ? '/user-home-page' : '/';
  
  const primaryOrange = '#ff6b35'; // The exact orange from the Hero section button
  const whiteColor = 'white';

  return (
    <Navbar expand="lg" className="shadow-sm py-3" style={{ backgroundColor: primaryOrange }}> {/* Orange background */}
      <Container>
        <Navbar.Brand href={homeHref} className="d-flex align-items-center">
          <Image 
            src="/images/club-oven-lovin-logo.png" 
            alt="Club Oven Lovin'"
            width={40} 
            height={40}
            className="me-2"
          />
          <span className="fw-bold" style={{ color: whiteColor }}> {/* This makes the brand text white */}
            Club Oven Lovin&apos;
          </span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/user-home-page" className="mx-2 nav-link-white-orange-hover" style={{ color: whiteColor }}> {/* White text, light grey hover */}
              Home
            </Nav.Link>
            <Nav.Link href="/browse-recipes" className="mx-2 nav-link-white-orange-hover" style={{ color: whiteColor }}>
              Recipes
            </Nav.Link>
            <Nav.Link href="/vendors" className="mx-2 nav-link-white-orange-hover" style={{ color: whiteColor }}>
              Vendors
            </Nav.Link>
            
            {currentUser && (
              <Nav.Link href="/add-recipe" className="mx-2 nav-link-white-orange-hover" style={{ color: whiteColor }}>
                Add Recipe
              </Nav.Link>
            )}
            
            {currentUser && role === 'ADMIN' && (
              <Nav.Link href="/admin" className="mx-2 nav-link-white-orange-hover" style={{ color: whiteColor }}>
                Admin
              </Nav.Link>
            )}
          </Nav>
          
          <Nav className="align-items-center">
            {session ? (
              <NavDropdown 
                id="login-dropdown" 
                title={<span style={{ color: whiteColor }}>{currentUser}</span>} // White text for dropdown title
                className="mx-2 nav-dropdown-white-text"
              >
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
                <Nav.Link href="/auth/signin" className="mx-2 nav-link-white-orange-hover" style={{ color: whiteColor }}> {/* White text */}
                  Sign In
                </Nav.Link>
                <Link href="/auth/signup" legacyBehavior>
                  <Button
                    as="a"
                    style={{
                      backgroundColor: whiteColor, // White background
                      borderColor: whiteColor,
                      color: primaryOrange, // Orange text
                      borderRadius: '20px',
                      padding: '8px 24px',
                      marginLeft: '10px',
                      fontWeight: '600'
                    }}
                    className="btn-signup-navbar" // Custom class for its specific hover
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
