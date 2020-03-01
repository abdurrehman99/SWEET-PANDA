import React, { Component } from 'react';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import { Link } from "react-router-dom";
import sweetalert from 'sweetalert';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { addToCart } from '../actions/cartAction';
import PropTypes from  'prop-types';

class MyCart extends Component {

    constructor(props){
        super(props);
        this.state = {
            user : {} ,
            address : '',
            paymentMethod : '',
            mycart : [],
            totalAmount : 0,
        }
    }

    componentDidMount = () =>{
        
            const { mycart } = this.props.cart;
            console.log(mycart);
            let { user } = this.props.auth;
            let totalAmount = 0;

            mycart.map(cart=>{
                totalAmount=totalAmount+Number(cart.price)*Number(cart.quantity);
            });
            this.setState({ totalAmount , user , mycart });
        
        
        if(this.props.auth.user.email === 'admin@sweetpanda.com') {
            this.props.history.push('/adminPanel');
        }
        
    }

    setAddress = (e) =>{
        this.setState({ address : e.target.value });
    }

    checkOut = () =>{
        console.log(this.state.mycart);
        let data = {
            user : this.state.user,
            address : this.state.address,
            paymentMethod : 'Cash on Delivery',
            mycart : this.state.mycart,
            totalAmount : this.state.totalAmount,
        }

        if(this.state.address === ""){
            sweetalert({
                icon : 'info',
                title: "Please enter your address !"
            });
        }
        else{
            axios.post('/api/orders',data)
            .then( res=>{
                sweetalert({
                    icon : 'success',
                    title: "Your Order has been placed !"
                });
                this.props.history.push("/")
                this.props.cart.mycart = [];
                console.log(res);
            })
            .catch( err=>{
                sweetalert({
                    icon : 'error',
                    title: "Error in sending your order !"
                });
                console.log(err);
            });
        }
    }

    stripePayment = (token)=>{

        var product = {
            price: this.state.totalAmount,
            name : "Sweets"
        }
        
        axios.post('/api/stripe', { token , product })
            .then( res=> {
                console.log(res.data.status);
            })
            .catch( err=> {
                console.log(err);
            });

            let data = {
                user : this.state.user,
                address : "Online Payment",
                paymentMethod : 'Stripe',
                mycart : this.state.mycart,
                totalAmount : this.state.totalAmount,
            }
            
        axios.post('/api/orders',data)
            .then( res=>{
                sweetalert({
                    icon : 'success',
                    title: "Your Order has been placed !"
                });
                this.props.history.push("/");
                this.props.cart.mycart = [];
                console.log(res);
            })
            .catch( err=>{
                sweetalert({
                    icon : 'error',
                    title: "Error in sending your order !"
                });
                console.log(err);
            });
    }

    deleteItem = (index)=>{
        console.log(index);
        let newCart = this.state.mycart;
        let totalAmount = 0;
        newCart.splice(index,1);
        newCart.map( cart=>{
            totalAmount=totalAmount+Number(cart.price)*Number(cart.quantity);
        });
        this.setState({
            mycart : newCart,
            totalAmount
        });
    }
    render() {
        if(this.props.auth.isAuthenticated === false){
            return ( 
                <div className="container mb-5 pb-5">
                    <div className="row">
                        <div className="col-xs-6 col-sm-9">
                            <h2 className='m-5'>You are not logged in <i className="fas fa-exclamation"></i></h2>
                        </div>
                        <div className="col-xs-4 col-sm-3">
                            <Link to='/login' className='mt-5 btn btn-secondary'><i className="fas fa-sign-in-alt"></i> Login</Link>
                            <Link to='/itemlist' className='mt-5 btn btn-primary float-right'><i className="fas fa-chevron-left"></i> Go Back</Link>
                        </div>
                    </div>
                </div>
            )
        }
        if(this.state.mycart.length === 0){
            return ( 
                <div className="container mb-5 pb-5">
                    <div className="row">
                        <div className="col-xs-6 col-sm-8">
                            <h2 className='m-5'><i className="text-danger fas fa-shopping-cart"></i> Your Cart is Empty !</h2>
                        </div>
                        <div className="col-xs-4 col-sm-4">
                            <Link to='/itemlist' className='m-5 btn btn-primary float-right'><i className="fas fa-chevron-left"></i> Go Back</Link>
                        </div>
                    </div>
                </div>
            )
        }
        else
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-6 col-sm-8">
                        <h2 className='my-4'>Your Cart <i className="fas fa-shopping-cart"></i> </h2>
                    </div>
                    <div className="col-xs-4 col-sm-4">
                        <Link to='/itemlist' className='my-4 btn btn-primary float-right'><i className="fas fa-chevron-left"></i> Go Back</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-9">
                        <Table hover bordered >
                        <thead>
                            <tr>
                                <th>S no.</th>
                                <th>Item Name</th>
                                <th>Vendor</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody> 
                            { this.state.mycart.map( (cart,index)=>{
                                
                                return (
                                    <tr>
                                        <td>{index+1}</td>
                                        <td>{cart.itemName}</td>
                                        <td>{cart.vendor}</td>
                                        <td>{cart.quantity}</td>
                                        <td>{cart.price}</td>
                                        <td>{Number(cart.price)*Number(cart.quantity)}</td>
                                        <td className='text-center'><button onClick={ ()=>this.deleteItem(index)} className='btn btn-outline-danger'><i className='fa fa-trash'></i></button></td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td><strong>Total Amount</strong></td>
                                <td><strong>{this.state.totalAmount} / -</strong></td>
                            </tr>
                        </tbody>
                        </Table>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <h4>Cash On Delivery <i className="fas fa-money-bill"></i></h4>
                        <input onChange={ (e)=>this.setAddress(e) } className='w-75 form-control my-3' placeholder='Enter Your Address*' />
                        <button onClick={this.checkOut} className='btn btn-outline-success my-1'><i className="fas fa-check-double"></i> Check Out </button>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6">
                        <h4 className='mb-3'>Stripe Checkout <i className="fab fa-cc-stripe"></i></h4>
                        <StripeCheckout 
                        stripeKey='pk_test_V086ENyvmzdzrDr3hZB3I5hI006Pgfs0TM'
                        token = {this.stripePayment} 
                        billingAddress 
                        amount={this.state.totalAmount} 
                        name='Sweet Panda' 
                        email={this.props.auth.user.email} />
                    </div>
                </div>
            </div>
                
        )
    }
}

MyCart.propTypes = {
    showCart : PropTypes.func.isRequired,
    cart : PropTypes.object.isRequired,
    addToCart : PropTypes.object.isRequired,

}

const mapStateToProps = (state) => ({
    cart : state.cart,
    auth: state.auth
})

export default connect( mapStateToProps,{ addToCart })(MyCart);