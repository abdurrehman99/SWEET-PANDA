import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { loginUser, setCurrentUser ,fbLogin } from '../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import sweetAlert from 'sweetalert';
import LoginImg from '../assets/login-img.jpg';
import FacebookLogin from 'react-facebook-login';
import './Login.css';

class Login extends Component {

    constructor(){
        super();
        this.state = {
            email : '',
            password : '',
            errors : { },
        };
       
    }
    handleChange = (e)=>{
        this.setState({ [e.target.name] : e.target.value });
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        const userData = {
            email : this.state.email.toLowerCase(),
            password : this.state.password,
        }
        this.props.loginUser(userData);
    }

    componentDidMount() {
      if(this.props.auth.user.email === 'admin@sweetpanda.com') {
          this.props.history.push('/adminPanel');
      }
      if(this.props.auth.isAuthenticated){
        this.props.history.push('/');
      }
    }
    
    componentWillReceiveProps(nextProps){

      if(nextProps.auth.isAuthenticated){
        this.props.history.push('/');
      }

      if(nextProps){
        this.setState({ errors : nextProps.errors })
      }
    }

    componentClicked = () => {
        console.log("Fb login clicked");
    }

    responseFacebook = (res) => {
        if(res.status !== 'unknown'){
          this.props.setCurrentUser({
            id : res.id,
            fullName : res.name,
            email : res.email,
            exp : res.expiresIn,
          });
          // this.props.fbLogin(res);
          sweetAlert({
            title: "You are now logged in to Sweet Panda !",
            icon: "success"
          });
        }
       
        console.log(res);
    }

    render() {
        let errors  = this.state.errors;
        return (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-sm-6 col-md-6 bg-img hide">
                <img className="bg-img" src={LoginImg} width="100%" alt="" />
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6 mt-4 pt-5 text-center">
                <h1>Login to your account </h1>
                <h4>Don't have a account?</h4>
                <Link className="btn btn-secondary mb-3 mt-2" to="/register">
                  <i className="fas fa-user-plus"></i> Sign Up
                </Link>
                <form noValidate onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      type="email"
                      className={classnames("form-control w-50 m-auto", {
                        "is-invalid": errors.email
                      })}
                      autoComplete="on"
                      name="email"
                      value={this.state.email}
                      placeholder="Enter your email"
                      onChange={this.handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className={classnames("form-control w-50 m-auto", {
                        "is-invalid": errors.password
                      })}
                      autoComplete="on"
                      name="password"
                      value={this.state.password}
                      placeholder="Password"
                      onChange={this.handleChange}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary mt-2 w-25">
                    <i className="fas fa-sign-in-alt" /> Login
                  </button>
                  <h4 className='m-2'>Or</h4>
                  
                </form>
                <FacebookLogin className='btn btn-secondary m-3 d-inline'
                    appId="1303183753225651"
                    autoLoad={false}
                    fields="name,email"
                    onClick={ this.componentClicked }
                    callback={ this.responseFacebook }
                    cssClass="my-facebook-button-class btn btn-primary"
                    icon="fa-facebook-square" />
                </div>
            </div>
              
          </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth : state.auth,
    errors : state.errors 
})

Login.proptype = {
    setCurrentUser : PropTypes.func.isRequired,
    loginUser : PropTypes.func.isRequired,
    auth : PropTypes.func.isRequired,
    errors : PropTypes.func.isRequired,
    fbLogin : PropTypes.func.isRequired
};

export default connect(mapStateToProps, {setCurrentUser, loginUser,fbLogin })(Login);
