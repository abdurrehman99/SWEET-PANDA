import React, { Component } from 'react';
import { connect } from "react-redux";
import Bakery from './Bakery';
import axios from 'axios';
import sweetAlert from 'sweetalert';
import validator from 'validator';
import { addVendor } from '../actions/vendorAction';
import './Showcase.css';
import { Spin } from "react-loading-io";

class Showcase extends Component {
    constructor(){
        super();
        this.state = {
            bakers : [],
            subscriber : '',
            proxy : "data:image/jpeg;base64,"
        }
    }
    componentDidMount() {
        if(this.props.auth.user.email === 'admin@sweetpanda.com') {
            this.props.history.push('/adminPanel');
        }
        else {
            axios.get('/api/getAllVendors')
            .then( res=>{
                this.setState({
                    bakers : res.data,
                });
                this.props.addVendor(this.state.bakers);
            console.log(res.data);
            })
            .catch( err=>{
                console.log(err);
            });
        }
    }

    setSubscriber = (e)=>{
        this.setState({ subscriber : e.target.value })
    }

    onSubscribe = ()=>{
        let data = { email : this.state.subscriber }

        if (!validator.isEmail(this.state.subscriber)){
            sweetAlert({
                title: "Email invalid (or) empty !",
                icon: "info",
            });
        }
        else{
            axios.post('/api/subscribe',data)
            .then( res=>{
                sweetAlert({
                    title: res.data.title,
                    icon: "success",
                });
            })
            .catch( err=>{
                sweetAlert({
                    title: 'You are already Subscribed !',
                    icon: "info",
                });
            });
            this.setState({ subscriber : '', });
        }
    }

    render() {
        return (
            <div>
                <div className='showcase-img container-fluid jumbotron'>
                    <div className='row text-white'>
                        <div className='col-xs-12 offset-sm-1 p-2 mt-2 w-100'>
                            <h2 className='display-3 mt-3'>Sweets & Desserts </h2>
                            </div>
                        <div className='col-xs-12 offset-sm-3 p-2 w-100 mt-5'>
                            <h2 className='display-4'>From Karachi's best Bakers</h2>
                        </div>
                    </div>    
                </div>
                <div className='container'>
                    <h2>Our Vendors</h2>
                    <hr/>
                    <div className='row text-center'>
                        { 
                            this.state.bakers.length === 0 ? <div style={{  marginLeft: '45%' }} >
                            <Spin size={100} color='#00008b' />
                            </div> : 
                            this.state.bakers.map( (baker,index)=>{
                            return <Bakery 
                            key={index}
                            name={baker.name}
                            image={this.state.proxy+baker.imgURL} />
                        })}
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-4 text-center">
                            <h2 className='mb-3'>About Us</h2>
                            <p className='about-us'>- Quality products</p>
                            <p className='about-us'>- Affordable rates</p>
                            <p className='about-us'>- On time delivery</p>
                        </div> 
                        <div className="col-xs-12 col-sm-12 col-md-4 text-center">
                            <h2 className='mb-4'>Subscribe Us</h2>
                            <h5 className='my-3'>Want Free Discount Vouchers</h5>
                            <h5 className='mb-4'>Subscribe to us & get connected !</h5>
                            <input value={ this.state.subscriber } onChange={ this.setSubscriber } type="email" placeholder='Enter your email' className="form-control w-75 m-auto"/>
                            <button onClick={ this.onSubscribe } className=' m-3 btn btn-primary'>Subscribe !</button>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-4">
                            <h2 className='mb-2 text-center'>Contact Us</h2>
                            <ul className="icon p-2">
                                <li><i className="fas fa-phone m-2"></i>+92-138346229</li>
                                <li><i className="fas fa-envelope m-2"></i>sweet.panda.mailer@gmail.com</li>
                                <li><i className="fab fa-facebook-square m-2"></i>/ sweet-panda</li>
                                <li><i className="fab fa-instagram m-2"></i>/ sweetpanda</li>
                            </ul>
                        </div> 
                    </div>
                    <hr />           
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    vendor : state.vendor
  });

export default connect(mapStateToProps ,{ addVendor })(Showcase);