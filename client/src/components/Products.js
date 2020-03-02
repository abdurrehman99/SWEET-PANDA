import React, { Component } from "react";
import { Rolling } from "react-loading-io";
import axios from "axios";
import classnames from 'classnames';
import { Table } from "reactstrap";
import sweetAlert from "sweetalert";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sweet : [],
      halwa : [],
      cake : [],
      nimko : [],
      setModal : false,
      editModel : false,
      _id: '',
      name : '',
      category : '',
      price : '',
      image : '',
      unit : '',
      nameError : false,
      categoryError : false,
      priceError : false,
    };
  }
  componentDidMount() {
    if (this.props.auth.user.email !== "admin@sweetpanda.com") {
      this.props.history.push("/");
    }
    let s = 'Sweet';
    axios.get('/api//getAllProducts/'+s)
    .then( res=>{
      console.log(res.data);
      this.setState({ sweet : res.data });
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
      this.setState({ cake : res.data });
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

  }
  deleteProduct = (_id,name)=>{
    console.log(_id,name);
    sweetAlert({
      title: `Are you sure want to delete\n"${name}" ?`,
      icon: "error",
      buttons: ["No", "Yes"],
      dangerMode: true,
      closeOnClickOutside: false
    })
    .then(willDelete=>{
      if(willDelete){
        axios.post('/api/deleteProduct',{ _id })
        .then(res=>{
          console.log(res);
          window.location.reload();
        })
        .catch(err=>{
          sweetAlert({
            icon : 'error',
            title : 'Something went wrong !'
          });
          console.log(err);
        })
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }
  openModel = ()=>{
    this.setState({ setModal : true });
  }

  closeModel = ()=>{
    this.setState({ 
      setModal : false,
      editModel : false,
      nameError : false,
      categoryError : false,
      priceError : false,
      name : '',
      category : '',
      price : '',
      image : '',
      unit : '',
    });
  }

  nameChange = (e)=>{
    console.log(e.target.value);
    if(e.target.value === '' ) this.setState({ nameError : true });
    else this.setState({ 
      name :  e.target.value,
      nameError : false,
    });   
  }

  categoryChange = (e)=>{
    this.setState({ category : e.target.value });
    if(e.target.value === 'Sweet' || e.target.value === 'Halwa') {
      this.setState({ unit : '/ KG' });
    }
    else if(e.target.value === 'Nimko' ){
      this.setState({ unit  : '/ 250 gm' });
    }
    else if(e.target.value === 'Cake'){
      this.setState({ unit  : '/ Cake' });
    }
    else {
      this.setState({ 
        unit  : '',
        categoryError : true,
      });
    }
    console.log(e.target.value);
  }

  priceChange = (e)=>{
    if(e.target.value === '' ) this.setState({ priceError : true });
    else this.setState({ 
      price :  e.target.value,
      priceError : false,
    });
    console.log(e.target.value);
  }

  imageChange = (e)=>{
    this.setState({ image : e.target.files[0] });
    console.log(this.state.image);
  }

  productAdd = ()=>{
    if(this.state.name === '' || this.state.price === '' || this.state.category === 'Select . . .' ){
      this.setState({
        nameError : true,
        priceError : true,
      });
    }
    else{
      var bodyFormData = new FormData();

      bodyFormData.set("name", this.state.name);
      bodyFormData.set("price", this.state.price);
      bodyFormData.set("category", this.state.category);
      bodyFormData.append("image", this.state.image);

      axios({
        method: "post",
        url: "/api/uploadProduct",
        data: bodyFormData,
        headers: { "Content-type": "multipart/form-data" }
      })
      .then( res=>{
        console.log(res);
        this.setState({ 
          setModal : false , 
          name : '' , 
          category : '' , 
          price : '', 
          image : '' 
        });
        sweetAlert({
            title: "New Product Added !",
            icon: "success",
            buttons: {
                cancel: {
                  text: "Cancel",
                  value: null,
                  visible: false,
                  closeModal: true,
                },
                confirm: {
                  text: "OK",
                  value: true,
                  visible: true,
                  closeModal: true
                }
            },
            closeOnClickOutside: false
        })
        .then(confirm =>{
          if(confirm) window.location.reload();
        });
      })
      .catch( err=>{
        console.log(err);
        sweetAlert({
          title : 'Ops something went wrong !',
          icon : 'error',
        });
      });
    }
  }

  productEdit = (_id,name,price,category)=>{
    let unit;
    if(category === 'Sweet' || category === 'Halwa') unit = '/ KG';
    if(category === 'Cake') unit = '/ Cake';
    if(category === 'Nimko') unit = '/ 250 gm'
    this.setState({ 
      editModel: true,
      _id ,
      name,
      price,
      category,
      unit ,
    });
    console.log(_id,name,price,category);
  }

  confirmEdit = ()=>{
    if(this.state.nameError === true || this.state.priceError === true){
      console.log('error');
    } 
    else{
      let data = { 
        _id : this.state._id,
        name : this.state.name,
        price : this.state.price,
        category : this.state.category,
      }
      axios.post('/api/editProduct',data)
      .then( res=>{
        sweetAlert({
          title: "Product Edited !",
          icon: "success",
          buttons: {
              cancel: {
                text: "Cancel",
                value: null,
                visible: false,
                closeModal: true,
              },
              confirm: {
                text: "OK",
                value: true,
                visible: true,
                closeModal: true
              }
          },
          closeOnClickOutside: false
      })
      .then(confirm =>{
          if(confirm) {
              window.location.reload();
          }
      });
      })
      .catch( err=>{
          sweetAlert({
              icon : 'error',
              title : 'Something went wrong !'
          });
          console.log(err);
      });
    }
  }

  render() {
    if(this.state.sweet.length === 0){
      return(
          <div style={{ marginTop : '25vh', marginLeft: '45vw' }} >
              <Rolling size={100} color='#00008b' />
          </div>
      )
    }
    else
    {
      return (
        <div className="container">
          <Modal isOpen={this.state.editModel}>
            <ModalHeader>
              <h4 className="p-0 m-0">Edit Product</h4>
            </ModalHeader>
            <ModalBody>
              <div className="row m-1">
                <div className="col-xs-12 col-sm-12 px-3">
                <label className="font-weight-bold">Name</label>
                  <input
                    onChange={e => this.nameChange(e)}
                    type="text"
                    defaultValue={this.state.name}
                    className={ classnames('w-75 form-control',{ 'is-invalid' : this.state.nameError })}
                  />
                </div>
                <div className="col-xs-12 col-sm-12 px-3">
                <label className="font-weight-bold mt-2">Category</label>
                  <select
                    onChange={e => this.categoryChange(e)} defaultValue={this.state.category}
                    className={ classnames('mb-2 w-75 form-control',{ 'is-invalid' : this.state.categoryError })} >
                    <option value="Sweet">Sweet</option>
                    <option value="Halwa">Halwa</option>
                    <option value="Cake">Cake</option>
                    <option value="Nimko">Nimko</option>
                  </select>
                </div>
                <div className="col-xs-12 col-sm-12 px-3">
                <label className="font-weight-bold">
                    Price {this.state.unit}
                  </label>
                  <input type="number" 
                  onChange={ (e)=>this.priceChange(e) } defaultValue={this.state.price}
                  className={ classnames('form-control w-75',{ 'is-invalid' : this.state.priceError })} />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={this.closeModel}>
                Cancel
              </Button>
              <Button color="primary" outline onClick={ () => this.confirmEdit() }>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.setModal}>
            <ModalHeader>
              <h4 className="p-0 m-0">Add new Product</h4>
            </ModalHeader>
            <ModalBody>
              <div className="row m-1">
                <div className="col-xs-12 col-sm-12 px-3">
                  <label className="font-weight-bold">Name</label>
                  <input
                    onChange={e => this.nameChange(e)}
                    type="text"
                    className={ classnames('w-75 form-control',{ 'is-invalid' : this.state.nameError })}
                  />
                </div>
                <div className="col-xs-12 col-sm-12 px-3">
                  <label className="font-weight-bold mt-2">Select Category</label>
                  <select
                    onChange={e => this.categoryChange(e)}
                    className={ classnames('mb-2 w-75 form-control',{ 'is-invalid' : this.state.categoryError })}
                  >
                    <option value="">Select . . .</option>
                    <option value="Sweet">Sweet</option>
                    <option value="Halwa">Halwa</option>
                    <option value="Cake">Cake</option>
                    <option value="Nimko">Nimko</option>
                  </select>
                </div>
                <div className="col-xs-12 col-sm-12 px-3">
                  <label className="font-weight-bold">
                    Price {this.state.unit}
                  </label>
                  <input type="number" 
                  onChange={ (e)=>this.priceChange(e) }
                  className={ classnames('form-control w-75',{ 'is-invalid' : this.state.priceError })} />
                </div>
                <div className="col-xs-12 col-sm-12 px-3">
                  <label className="mt-2 font-weight-bold">Image</label>
                  <input type="file" onChange={ (e)=> this.imageChange(e) } className="form-control-file" />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={this.closeModel}>
                Cancel
              </Button>
              <Button color="primary" outline onClick={ () => this.productAdd() }>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <h2 className="my-3">Product(s) List</h2>
            </div>
            <div className="col-xs-12 col-sm-4">
              <button
                onClick={this.openModel}
                className="my-3 btn btn-success float-right"
              >
                <i className="fas fa-plus"></i> Add New
              </button>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-xs-12 col-sm-10">
              <h3 className="">Sweets</h3>
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>S no.</th>
                    <th>Name</th>
                    <th>Price / KG</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.sweet.map( (s,index)=>{
                      return(
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{s.name}</td>
                          <td>{s.price}</td>
                          <td>{s.category}<button onClick={ ()=> this.deleteProduct(s._id,s.name) } className='float-right btn btn-danger'><i className='fa fa-trash'></i> Delete Item</button><button onClick={()=>this.productEdit(s._id,s.name,s.price,s.category)} className='float-right btn btn-primary mx-2'><i className='fa fa-edit'></i> Edit Item</button></td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-10">
              <h3 className="">Halwa</h3>
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>S no.</th>
                    <th>Name</th>
                    <th>Price / KG</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                {
                    this.state.halwa.map( (s,index)=>{
                      return(
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{s.name}</td>
                          <td>{s.price}</td>
                          <td>{s.category}<button onClick={ ()=> this.deleteProduct(s._id,s.name) } className='float-right btn btn-danger'><i className='fa fa-trash'></i> Delete Item</button><button onClick={()=>this.productEdit(s._id,s.name,s.price,s.category)} className='float-right btn btn-primary mx-2'><i className='fa fa-edit'></i> Edit Item</button></td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-10">
              <h3 className="">Cakes</h3>
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>S no.</th>
                    <th>Name</th>
                    <th>Price / Cake</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                {
                    this.state.cake.map( (s,index)=>{
                      return(
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{s.name}</td>
                          <td>{s.price}</td>
                          <td>{s.category}<button onClick={ ()=> this.deleteProduct(s._id,s.name) } className='float-right btn btn-danger'><i className='fa fa-trash'></i> Delete Item</button><button onClick={()=>this.productEdit(s._id,s.name,s.price,s.category)} className='float-right btn btn-primary mx-2'><i className='fa fa-edit'></i> Edit Item</button></td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-10">
              <h3 className="">Nimko</h3>
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>S no.</th>
                    <th>Name</th>
                    <th>Price / 250gm</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                {
                    this.state.nimko.map( (s,index)=>{
                      return(
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{s.name}</td>
                          <td>{s.price}</td>
                          <td>{s.category}<button onClick={ ()=> this.deleteProduct(s._id,s.name) } className='float-right btn btn-danger'><i className='fa fa-trash'></i> Delete Item</button><button onClick={()=>this.productEdit(s._id,s.name,s.price,s.category)} className='float-right btn btn-primary mx-2'><i className='fa fa-edit'></i> Edit Item</button></td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Products);
