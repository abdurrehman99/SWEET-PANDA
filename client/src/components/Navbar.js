import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import './Showcase.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

class myNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      navCollapsed: true,
      showNavbar: false
    };
  }

  onLogout = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  render() {
    const { isAuthenticated ,user } = this.props.auth;
    const adminLinks = (
      <Navbar color="dark"  className="py-0" dark expand="md">
        <NavbarBrand>
          <Link className="navbar-brand" to="/adminPanel">
          <i className="fas fa-cookie-bite"></i> Sweet Panda 
          </Link>
        </NavbarBrand>
        <span style={{"color" : "white"}}>{this.props.auth.user.fullName} <i className="fas fa-user-shield"></i></span>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
          <NavItem>
              <NavLink>
                  <Link className="nav-link" to="/users">
                    <i className="fas fa-user"></i> Users
                  </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <Link className="nav-link" to="/orders">
                <i className="fas fa-clipboard-list"></i> Orders
                </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <Link className="nav-link" to="/vendors">
                <i className="fas fa-store"></i> Vendors
                </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <Link className="nav-link" to="/products">
                <i className="fas fa-boxes"></i> Products
                </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <Link className="nav-link" to={null} onClick={this.props.logoutUser}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Link>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );

    const guestLinks = (
      <Navbar color="dark" className="py-0" dark expand="md">
        <NavbarBrand>
          <Link className="navbar-brand mx-2" to="/">
            <i className="fas fa-cookie-bite"></i> Sweet Panda
          </Link>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink>
                <Link className="nav-link" to="/itemlist">
                 View Products
                </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                  <Link className="nav-link" to="/mycart">
                    <i className="fas fa-shopping-cart"></i> My Cart
                    <span className="mx-1 badge badge-secondary">{this.props.cart.mycart.length}</span>
                  </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <Link className="nav-link" to="/login">
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );

    const authLinks = (
      <Navbar color="dark"  className="py-0" dark expand="md">
        <NavbarBrand>
          <Link className="navbar-brand m-0 p-0" to="/">
            <i className="fas fa-cookie-bite"></i> Sweet Panda
          </Link>
        </NavbarBrand>
        <span style={{"color" : "white"}}>| {this.props.auth.user.fullName}</span>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink>
                <Link className="nav-link" to="/itemlist">
                  View Products
                </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                  <Link className="nav-link" to="/mycart">
                    <i className="fas fa-shopping-cart"></i> My Cart
                    <span className="mx-1 badge badge-secondary">{this.props.cart.mycart.length}</span>
                  </Link>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink>
                <Link className="nav-link" onClick={this.props.logoutUser}>
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Link>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
    if(isAuthenticated && user.email === "admin@sweetpanda.com") return adminLinks ;

    else if(isAuthenticated) return authLinks;
    
    else return guestLinks;
  }
}

myNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  cart : state.cart,
});

export default connect(mapStateToProps, { logoutUser })(myNavbar);
