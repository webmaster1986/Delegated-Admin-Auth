import React, { Component } from 'react';
import {
  Container,
  Nav,
  Navbar
} from 'react-bootstrap';
import {Link} from "react-router-dom"
import axios from 'axios';
import fdny from './images/FDNY.png';
import "./nav.css"
import MobileMenu from "./MobileMenu";
import {ApiService} from "../services/ApiService";

class Header extends Component {
  _apiService = new ApiService();
  state = {
    loginUser: ''
  }

  async componentDidMount() {
    this.setState({
      isLoading: true
    })
    const data =  await this._apiService.getLoginUserName()
    if (!data || data.error) {
      return
    } else {
      this.setState({
        loginUser: (data && data.result) || ""
      })
    }
  }

  handleLogoutBtnClick = async () => {
    const hostUrl = window.location.protocol+'//'+window.location.host;
    let url = hostUrl + `/SelfService/webapi/authapi/logout`;
    await axios.post(url);
    window.location.href = "/oamsso/logout.html?end_url=/SelfService/logout"
  }

  getReactAppEnv  = () => {
    const host = window.location.host;
    let env = "";
    if (host.includes("dev")) {
      console.log ("dev");
      env = "dev";
    } else if (host.includes("tst")) {
      console.log ("tst");
      env = "tst";
    } else if (host.includes("stg")) {
      console.log ("stg");
      env = "stg";
    } else {
      console.log ("prod");
      env = "prod";
    }
    return env
  }

  render() {
    const { loginUser } = this.state
    const envMode =  this.getReactAppEnv();
    const className = envMode === 'dev' ? 'green-banner' : envMode === 'tst' ? 'blue-banner' : envMode === 'stg' ? 'purple-banner' : 'red-banner';

    return (
      <div
        className={`${className} header-nav`}
      >
        <Container>
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Brand href='http://www.fdny.org' target="_blank">
              <img
                src={fdny}
                alt='FDNY icon'
                style={{height: '60px'}}
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto desktop-menu">
                <ul className="nav">
                  <li>
                    <Nav.Item>
                      <Link to="/SelfService/auth/my-profile" className={'nav-link color-white'}>
                        My Profile
                      </Link>
                    </Nav.Item>
                  </li>
                  <li>
                    <Nav.Item>
                      <Link to="/SelfService/auth/change-password" className={'nav-link color-white'}>
                        Change Password
                      </Link>
                    </Nav.Item>
                  </li>
                  <li>
                    <Nav.Item>
                      <Link to="/SelfService/auth/security-question" className={'nav-link color-white'}>
                        Security Questions
                      </Link>
                    </Nav.Item>
                  </li>
                </ul>
              </Nav>
              <MobileMenu/>
              <div className="header-nav-right">
                <h6 className="wc-username">{loginUser ? `Welcome ${loginUser}` : ""}</h6>
                <a className="logout" onClick={this.handleLogoutBtnClick}>Logout</a>
              </div>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
    );
  }
}

export default Header;
