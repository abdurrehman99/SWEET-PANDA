import React, { Component } from "react";
import { Spin } from "react-loading-io";
import { connect } from 'react-redux';
import { addToCart } from '../actions/cartAction';
import PropTypes from  'prop-types';
import classnames from 'classnames';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, CardBody, CardTitle,TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardText } from 'reactstrap';

class ItemsList extends Component {
  constructor() {
    super();
    this.state = {
      activeTab : '1',
      setModal : false,
      vendorList : [],
      itemName : '' , 
      price : '',
      vendor : '' ,
      quantity : '' ,
      quantityError : false,
      vendorError : false,
      sweets: [],
      halwa: [],
      cakes: [],
      nimko: [],
      proxy : "data:image/jpeg;base64,",
      search : '',
    }
  }

  componentDidMount() {
    if(this.props.auth.user.email === 'admin@sweetpanda.com') {
      this.props.history.push('/adminPanel');
    }
    else{
      
      let s = 'Sweet';
      axios.get('/api//getAllProducts/'+s)
        .then( res=>{
          console.log(res.data);
          this.setState({ sweets : res.data });
        })
        .catch( err=>{
          console.log(err);
        });

      let h = 'Halwa';
      axios.get('/api//getAllProducts/'+h)
        .then( res=>{
          console.log(res.data);
          this.setState({ halwa : res.data });
        })
        .catch( err=>{
          console.log(err);
        });

      let c = 'Cake';
      axios.get('/api//getAllProducts/'+c)
        .then( res=>{
          console.log(res.data);
          this.setState({ cakes : res.data });
        })
        .catch( err=>{
          console.log(err);
        });

      let n = 'Nimko';
      axios.get('/api//getAllProducts/'+n)
        .then( res=>{
          console.log(res.data);
          this.setState({ nimko : res.data });
        })
        .catch( err=>{
          console.log(err);
        });

      axios.get('/api/getAllVendors')
        .then( res=>{
            this.setState({
              vendorList : res.data,
            });
           console.log(res.data);
        })
        .catch( err=>{
            console.log(err);
        });
    }
  }

  addCart = (itemName,price) =>{;
    this.setState({
      itemName , 
      price ,
      setModal : true,
    });
  }

  addAllToCart = () => {
    if(this.state.vendor === '' || this.state.quantity === '' || this.state.vendor === 'Select Vendor' || this.state.quantity === 'Select Quantity'){
      this.setState({
        quantityError : true,
        vendorError : true,
      });
    }
    else{
      let data = {
        itemName : this.state.itemName,
        price : this.state.price,
        vendor : this.state.vendor,
        quantity : this.state.quantity
      }
      this.setState( (prevState,props)=>{
       return {
          quantityError : false,
          vendorError : false, 
          setModal : false,
          vendor : '',
          quantity : '',
       }
      });
      this.props.addToCart(data);
      let local = [...this.props.cart.mycart,data];
      localStorage.setItem("cart",JSON.stringify(local));
    }
  }

  vendorChange = (e) =>{
    this.setState({ vendor :  e.target.value });
  }

  quantityChange = (e)=>{
    this.setState({ quantity :  e.target.value });
  }
  
  closeModel = () =>{
    this.setState({ 
      quantityError : false,
      vendorError : false,
      setModal : false,
    });
  }
  toggle = (tab) => {
    if(this.state.activeTab !== tab) this.setState({ 
      activeTab : tab,
      search : '',
    });
  }
  search = (e)=>{
    let value = e.target.value.toLowerCase();
    console.log(value);
    this.setState({
        search : value,
    });
  }
  render() {
    let filteredSweets = this.state.sweets.filter( s =>{
      let filteredName = s.name.toLowerCase();
      return filteredName.indexOf(this.state.search) !== -1
    });
    let filteredHalwa = this.state.halwa.filter( h =>{
      let filteredName = h.name.toLowerCase();
      return filteredName.indexOf(this.state.search) !== -1
    });
    let filteredCakes = this.state.cakes.filter( c =>{
      let filteredName = c.name.toLowerCase();
      return filteredName.indexOf(this.state.search) !== -1
    });
    let filteredNimko = this.state.nimko.filter( n =>{
      let filteredName = n.name.toLowerCase();
      return filteredName.indexOf(this.state.search) !== -1
    });
    if(this.state.sweets.length === 0){
      return(
          <div style={{ marginTop : '25vh', marginLeft: '45vw' }} >
              <Spin size={100} color='#00008b' />
          </div>
      )
    }
    else{
      return (
        <div className="container">
            <Modal isOpen={this.state.setModal}>
              <ModalHeader>Choose Vendor & Quantity</ModalHeader>
              <ModalBody>
                <div className="row">
                  <div className="col-xs-12 col-sm-6">
                      <select onChange={ (e)=> this.quantityChange(e) } className={ classnames('my-2 form-control float-right',{ 'is-invalid' : this.state.quantityError })} >
                          <option>Select Quantity</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='4'>4</option>
                          <option value='5'>5</option>
                      </select>
                        
                  </div>
                  <div className="col-xs-12 col-sm-6">
                      <select onChange={ (e)=> this.vendorChange(e) } className={ classnames('my-2 form-control',{ 'is-invalid' : this.state.vendorError })}>
                          <option>Select Vendor</option>
                          {
                            this.state.vendorList.map( (v,index)=>{
                              return(
                                <option key={index} value={v.name}>{v.name}</option>
                              )
                            })
                          }
                      </select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" outline onClick={this.closeModel}>Cancel</Button>
                <Button color="primary" outline onClick={this.addAllToCart}>Done</Button>
              </ModalFooter>
            </Modal>
            <Nav className='mt-3' tabs>
              <NavItem>
                <NavLink style ={{ cursor : 'pointer'}}
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1') }} >
                  Sweets
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style ={{ cursor : 'pointer'}}
                  className={classnames({ active: this.state.activeTab === '2' })}
                  onClick={() => { this.toggle('2') }} >
                  Halwa
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style ={{ cursor : 'pointer'}}
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3') }} >
                  Cakes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style ={{ cursor : 'pointer'}}
                  className={classnames({ active: this.state.activeTab === '4' })}
                  onClick={() => { this.toggle('4') }} >
                  Nimko
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <div className="row mt-3">
                <div className="col-xs-8 col-sm-8">
                  <h2>Traditional Sweets</h2>
                </div>
                <div className='col-xs-4 col-sm-4'>
                  <input className='form-control' type='text' placeholder='Search here...' onChange={ (e)=>this.search(e) } />
                </div>
              </div>
              <div className="row text-center">
                { filteredSweets.map( (sweet,index) => {
                    return <div key={index} className="col-xs-12 col-sm-4 col-md-3 p-2">
                              <Card className="bakery-card">
                                  <CardBody>
                                    <CardTitle><h5>{sweet.name}</h5></CardTitle>
                                    <img width="100%" style={{ borderRadius : '50%'}} src={this.state.proxy+sweet.imgURL} alt='' />
                                    <CardText>
                                      <p className='m-2'>{sweet.price} / kg</p>
                                    </CardText>
                                    <button onClick={ ()=>this.addCart(sweet.name,sweet.price) } className="btn btn-outline-primary"><i className="fas fa-cart-plus"></i> Add to cart</button>
                                  </CardBody>
                              </Card>
                          </div>
                })}
              </div>
            </TabPane>
            <TabPane tabId="2">
              <div className="row mt-3">
                  <div className="col-xs-8 col-sm-8">
                    <h2>Halwa</h2>
                  </div>
                  <div className='col-xs-4 col-sm-4'>
                    <input className='form-control' type='text' placeholder='Search here...' onChange={ (e)=>this.search(e) } />
                  </div>
                </div>
                <div className="row text-center">
                  { filteredHalwa.map( (halwa,index) =>{
                      return <div key={index} className="col-xs-12 col-sm-4 col-md-3 p-2">
                                <Card className="bakery-card">
                                    <CardBody>
                                      <CardTitle><h5>{halwa.name}</h5></CardTitle>
                                      <img width="100%" style={{ borderRadius : '50%'}} src={this.state.proxy+halwa.imgURL} alt='' />
                                      <CardText>
                                        <p className='m-2'>{halwa.price} / kg</p>
                                      </CardText>
                                      <button onClick={ ()=>this.addCart(halwa.name,halwa.price) } className="btn btn-outline-primary"><i className="fas fa-cart-plus"></i> Add to cart</button>
                                    </CardBody>
                                </Card>
                            </div>
                  })}
              </div>
            </TabPane>
            <TabPane tabId="3">
              <div className="row mt-3">
                <div className="col-xs-8 col-sm-8">
                  <h2>Cakes</h2>
                </div>
                <div className='col-xs-4 col-sm-4'>
                  <input className='form-control' type='text' placeholder='Search here...' onChange={ (e)=>this.search(e) } />
                </div>
              </div>
              <div className="row text-center">
              { filteredCakes.map( (cakes,index) => {
                    return <div key={index} className="col-xs-12 col-sm-4 col-md-3 p-2">
                              <Card className="bakery-card">
                                  <CardBody>
                                    <CardTitle><h5>{cakes.name}</h5></CardTitle>
                                    <img width="100%" style={{ borderRadius : '50%'}} src={this.state.proxy+cakes.imgURL} alt='' />
                                    <CardText>
                                        <p className='m-2'>{cakes.price} Rs</p>
                                    </CardText>
                                    <button onClick={ ()=>this.addCart(cakes.name,cakes.price) } className="btn btn-outline-primary"><i className="fas fa-cart-plus"></i> Add to cart</button>
                                  </CardBody>
                              </Card>
                          </div>
                })}
              </div>
            </TabPane>
            <TabPane tabId="4">
              <div className="row mt-3">
                <div className="col-xs-8 col-sm-8">
                  <h2>Mix Nimco</h2>
                </div>
                <div className='col-xs-4 col-sm-4'>
                  <input className='form-control' type='text' placeholder='Search here...' onChange={ (e)=>this.search(e) } />
                </div>
              </div>
              <div className="row text-center">
                { filteredNimko.map( (nimko,index) =>{
                    return <div key={index} className="col-xs-12 col-sm-4 col-md-3 p-2">
                              <Card className="bakery-card">
                                  <CardBody>
                                    <CardTitle><h5>{nimko.name}</h5></CardTitle>
                                    <img width="100%" style={{ borderRadius : '50%'}} src={this.state.proxy+nimko.imgURL} alt='' />
                                    <CardText>
                                      <p className='m-2'>{nimko.price}Rs / pack</p>
                                    </CardText>
                                    <button onClick={ ()=>this.addCart(nimko.name,nimko.price) } className="btn btn-outline-primary"><i className="fas fa-cart-plus"></i> Add to cart</button>
                                  </CardBody>
                              </Card>
                          </div>
                })}
              </div>
            </TabPane>
          </TabContent> 
  
        </div>
      );
    }
  }
}

ItemsList.propTypes = {
  addToCart : PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  cart : state.cart,
  auth: state.auth,
  vendor : state.vendor
});

export default connect( mapStateToProps, { addToCart })(ItemsList);
