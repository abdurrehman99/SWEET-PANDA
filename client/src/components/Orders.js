import React, { Component } from 'react';
import { Rolling } from "react-loading-io";
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import axios from 'axios';

class Orders extends Component {
    constructor(props){
        super(props);
        this.state = {
            allOrders : []
        }
    }
    componentDidMount(){
        if(this.props.auth.user.email !== 'admin@sweetpanda.com'){
            this.props.history.push('/');
        }
    axios.get('/api/getAllOrders')
        .then(res=>{
            this.setState({ allOrders : res.data });
            console.log(res.data);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    render() {
        if(this.state.allOrders.length === 0){
            return(
                <div style={{ marginTop : '25vh', marginLeft: '45vw' }} >
                    <Rolling size={100} color='#00008b' />
                </div>
            )
        }
        else{
            return (
                <div className='container'>
                    <div className="row">
                        <div className="col-xs-12 col-sm-8">
                            <h2 className='my-3'>Order(s) List</h2>
                        </div>
                        <div className="col-xs-12 col-sm-2">
                            <Link to='/adminPanel' className='my-3 btn btn-primary float-right'><i className="fas fa-chevron-left"></i> Go Back</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-10">
                        {
                            this.state.allOrders.map( data=>{
                                return (
                                    <div>
                                        <hr/>
                                        <h6>Name : {data.user.fullName}</h6>
                                        <h6>Email : {data.user.email}</h6>
                                        <h6>Payment Method : {data.paymentMethod}</h6>
                                        <h6>Address : {data.address}</h6>
                                        <h6>Total Amount Charged : <strong>{data.totalAmount}</strong></h6>
                                        <Table hover bordered >
                                            <thead>
                                                <tr>
                                                    <th>S no.</th>
                                                    <th>Item(s) Purchased</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Vendor</th>
                                                </tr>
                                            </thead>
                                            <tbody> 
                                                {
                                                    data.cart.map((element,index) => {
                                                        return (
                                                            <tr>
                                                                <td>{index+1}</td>
                                                                <td>{element.itemName}</td>
                                                                <td>{element.quantity}</td>
                                                                <td>{element.price}</td>
                                                                <td>{element.vendor}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>)})
                        }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default  connect(mapStateToProps)(Orders);
