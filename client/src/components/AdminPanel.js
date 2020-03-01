import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

class AdminPanel extends Component {

    componentDidMount(){
        if(this.props.auth.user.email !== 'admin@sweetpanda.com'){
            this.props.history.push('/');
        }
    }
    render(){
        return(
            <div className='container'>
                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <h2 className='my-3'>Admin Panel</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-3">
                        <Link to='/users' className='w-100 btn btn-outline-primary my-2'><i className="fas fa-user"></i> View Users</Link>
                    </div>
                    <div className="col-xs-12 col-sm-3">
                        <Link to='/orders' className='w-100 btn btn-outline-primary my-2'><i className="fas fa-clipboard-list"></i> View Orders</Link>
                    </div>
                    <div className="col-xs-12 col-sm-3">
                        <Link to='/vendors' className='w-100 btn btn-outline-primary my-2'><i className="fas fa-store"></i> View Vendors</Link>
                    </div>
                    <div className="col-xs-12 col-sm-3">
                        <Link to='/products' className='w-100 btn btn-outline-primary my-2'><i className="fas fa-boxes"></i> View Products</Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default  connect(mapStateToProps)(AdminPanel);