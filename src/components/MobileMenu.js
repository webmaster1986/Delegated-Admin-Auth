import React from 'react';
import {Nav} from 'react-bootstrap';
import {Link} from "react-router-dom"

const MobileMenu = () => {
  return (
    <Nav className="mr-auto mobile-menu">
      <Nav.Item>
        <Link to="/SelfService/auth/my-profile" className={'nav-link color-white'}>
          My Profile
        </Link>
      </Nav.Item>
      <Nav.Item>
        <Link to="/SelfService/auth/change-password" className={'nav-link color-white'}>
          Change Password
        </Link>
      </Nav.Item>
    </Nav>
  )
}

export default MobileMenu;
