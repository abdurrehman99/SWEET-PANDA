import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import setAuthToken from "./utils/setAuthToken";
import jwtDecode from "jwt-decode";
import { connect } from "react-redux";
import { fillCart } from "./actions/cartAction";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from "./store";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import MyCart from "./components/MyCart";
import Register from "./components/Register";
import Showcase from "./components/Showcase";
import ItemList from "./components/ItemsList";
import AdminPanel from "./components/AdminPanel";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Products from "./components/Products";
import Vendors from "./components/Vendors";
import Footer from "./components/Footer";

//Chk for cart in Local storage
if (localStorage.cart) {
  let cartData = JSON.parse(localStorage.getItem("cart"));
  // console.log(cartData);

  //dispatch CART to redux
  store.dispatch(fillCart(cartData));
}

//Chk for token
if (localStorage.jwtToken) {
  //Set Auth token for header
  setAuthToken(localStorage.jwtToken);

  //Decode token & get User info
  const decoded = jwtDecode(localStorage.jwtToken);

  //Set User isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //chk for expired token
  const currentTime = Date.now / 1000;
  if (decoded.exp < currentTime) {
    //logout user
    store.dispatch(logoutUser());
    //redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {

  render() {
    return (
      <Router>
        <Navbar />
        <Route exact path="/" component={Showcase} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/itemlist" component={ItemList} />
        <Route exact path="/mycart" component={MyCart} />
        <Route exact path="/adminPanel" component={AdminPanel} />
        <Route exact path="/orders" component={Orders} />
        <Route exact path="/vendors" component={Vendors} />
        <Route exact path="/products" component={Products} />
        <Route exact path="/users" component={Users} />
        <Footer />
      </Router>
    );
  }
}

export default connect()(App);
