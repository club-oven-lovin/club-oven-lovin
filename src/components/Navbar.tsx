/* eslint-disable react/jsx-indent, indent */

'use client';

import { useSession } from 'next-auth/react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { BoxArrowRight, Lock } from 'react-bootstrap-icons';
import Link from 'next/link';
import Image from 'next/image';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email ?? '';
  const userWithRole = session?.user as { email: string; randomKey: string } | undefined;
  const role = userWithRole?.randomKey;
  const homeHref = session ? '/user-home-page' : '/';

  const primaryOrange = '#ff6b35'; // The exact orange from the Hero section button
  const whiteColor = 'white';

  return (
    <Navbar
      expand="lg"
      className="shadow-sm py-3"
      style={{ backgroundColor: primaryOrange }}
    >
      <Container>
        <Navbar.Brand href={homeHref} className="d-flex align-items-center">
          <Image
            src="/images/club-oven-lovin-logo.png"
            alt="Club Oven Lovin'"
            width={40}
            height={40}
            className="me-2"
          />
          <span className="fw-bold" style={{ color: whiteColor }}>
            Club Oven Lovin&apos;
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* LEFT SIDE LINKS (only for logged-in users) */}
          <Nav className="ms-auto align-items-center">
            {session && (
              <>
                {/* Home + Recipes: all signed-in users */}
                <Nav.Link
                  href="/user-home-page"
                  className="mx-2 nav-link-white-orange-hover"
                  style={{ color: whiteColor }}
                >
                  Home
                </Nav.Link>

                <Nav.Link
                  href="/browse-recipes"
                  className="mx-2 nav-link-white-orange-hover"
                  style={{ color: whiteColor }}
                >
                  Recipes
                </Nav.Link>

                {/* Add Recipe: normal users only */}
                {role === 'USER' && (
                  <Nav.Link
                    href="/add-recipe"
                    className="mx-2 nav-link-white-orange-hover"
                    style={{ color: whiteColor }}
                  >
                    Add Recipe
                  </Nav.Link>
                )}


              </>
            )}
          </Nav>

          {/* RIGHT SIDE: auth controls */}
          <Nav className="align-items-center">
            {session ? (
              <NavDropdown
                id="login-dropdown"
                title={<span style={{ color: whiteColor }}>{currentUser}</span>}
                className="mx-2 nav-dropdown-white-text"
              >
                {role === 'ADMIN' ? (
                  <NavDropdown.Item id="login-dropdown-admin" href="/admin">
                    Admin Dashboard
                  </NavDropdown.Item>
                ) : role === 'VENDOR' ? (
                  <NavDropdown.Item id="login-dropdown-vendor" href="/vendors">
                    Vendor Dashboard
                  </NavDropdown.Item>
                ) : (
                  <NavDropdown.Item id="login-dropdown-profile" href="/userprofile">
                    User Profile
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />{' '}
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />{' '}
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {/* Landing page users: only see Sign In + Sign Up */}
                <Nav.Link
                  href="/auth/signin"
                  className="mx-2 nav-link-white-orange-hover"
                  style={{ color: whiteColor }}
                >
                  Sign In
                </Nav.Link>
                <Link href="/auth/signup" legacyBehavior>
                  <Button
                    as="a"
                    style={{
                      backgroundColor: whiteColor,
                      borderColor: whiteColor,
                      color: primaryOrange,
                      borderRadius: '20px',
                      padding: '8px 24px',
                      marginLeft: '10px',
                      fontWeight: '600',
                    }}
                    className="btn-signup-navbar"
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
