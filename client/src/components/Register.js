import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { registerUser } from '../actions/authActions'
import LoginImg from '../assets/login-img.jpg';
import './Login.css';

class Register extends Component {
    constructor(){
        super();
        this.state = {
            fullName : '',
            mobileNo : '',
            email : '',
            password : '',
            password2 : '',
            errors : { },
        };

    }
    handleChange = (e)=>{
        this.setState({ [e.target.name] : e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const newUser = {
            fullName : this.state.fullName,
            email : this.state.email.toLowerCase(),
            password : this.state.password,
            password2 : this.state.password2,
            mobileNo : this.state.mobileNo,
        }
        this.props.registerUser(newUser,this.props.history);
        
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
        if(nextProps.errors){
            this.setState({ errors :nextProps.errors });
        }
        else{
            this.setState({ errors : {} });

        }
    }

    render() {
        let errors  = this.state.errors;
        return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 bg-img hide">
                            <img src={LoginImg} width='100%' alt='' />
                        </div>
                        <div className="col-xs-12 col-sm-6 mt-5 p-5">
                            <h1 className='text-center'>Sign up to Sweet Panda !</h1>
                            <form noValidate onSubmit = { (e)=> this.handleSubmit(e) }>
                                <div className="form-group mt-5">
                                    <label htmlFor="email">Email</label>
                                        <input type="email" 
                                        className = { classnames('form-control w-75',{ 'is-invalid' : errors.email })} 
                                        placeholder="Enter your email" 
                                        name = 'email'
                                        autoComplete = 'on' 
                                        value = { this.state.email } 
                                        onChange={this.handleChange} />
                                        <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                                        { errors.email && (<div className = 'invalid-feedback'>{errors.email}</div>) }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                        <input type="text" 
                                        name = 'fullName'
                                        autoComplete = 'on'
                                        className = { classnames('form-control w-75',{ 'is-invalid' : errors.fullName })}  
                                        placeholder = "Enter your full name" 
                                        value = {this.state.fullName } 
                                        onChange={this.handleChange} />
                                        { errors.fullName && (<div className = 'invalid-feedback'>{errors.fullName}</div>) }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mobileNo">Mobile No.</label>
                                        <input type="text"  
                                        className = { classnames('form-control w-75',{ 'is-invalid' : errors.mobileNo })}  
                                        name = 'mobileNo'
                                        autoComplete = 'on'
                                        maxLength = '11'
                                        placeholder = '03xxxxxxxxx'
                                        value = {this.state.mobileNo}
                                        onChange={this.handleChange} />
                                        { errors.mobileNo && (<div className = 'invalid-feedback'>{errors.mobileNo}</div>) }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password1">Password</label>
                                        <input type = "password" 
                                        className = { classnames('form-control w-75',{ 'is-invalid' : errors.password })} 
                                        name = 'password' 
                                        autoComplete = 'on'
                                        placeholder = "Password" 
                                        value = {this.state.password} 
                                        onChange={this.handleChange} />
                                        { errors.password && (<div className = 'invalid-feedback'>{errors.password}</div>) }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password2">Confirm Password</label>
                                        <input type="password" 
                                        className = { classnames('form-control w-75',{ 'is-invalid' : errors.password2 })}  
                                        name = 'password2'
                                        autoComplete = 'on'
                                        placeholder="Re-type password" 
                                        value={this.state.password2} 
                                        onChange={this.handleChange} />
                                        { errors.password2 && (<div className = 'invalid-feedback'>{errors.password2}</div>) }
                                </div>
                                <button type="submit" className="btn btn-primary mt-2 w-25"><i className="fas fa-user-plus"></i> Sign Up</button>
                            </form>
                        </div>
                    </div>
                </div>
        )
    }
}

Register.propTypes = {
    registerUser : PropTypes.func.isRequired,
    auth : PropTypes.object.isRequired,
    errors : PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth : state.auth,
    errors : state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));