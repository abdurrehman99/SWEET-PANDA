import React, { Component } from "react";
import { Rolling } from "react-loading-io";
import classnames from 'classnames';
import axios from "axios";
import { Table } from "reactstrap";
import sweetAlert from "sweetalert";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allVendors: [],
      setModal : false,
      name : '',
      image : '',
      vendorError : false,
    };
  }
  componentDidMount() {
    if (this.props.auth.user.email !== "admin@sweetpanda.com") {
      this.props.history.push("/");
    }

    axios
      .get("/api/getAllVendors")
      .then(res => {
        this.setState({ allVendors: res.data });
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  deleteVendor = (id,name,index)=>{
    console.log(id,name);
      sweetAlert({
          title: `Are you sure want to delete\n"${name}" ?`,
          icon: "error",
          buttons: ["No", "Yes"],
          dangerMode: true,
          closeOnClickOutside: false
        })
          .then( willDelete => {
              if (willDelete) {
                axios.post('/api/deleteVendor/'+id)
                .then( res=>{
                  console.log(res);
                    sweetAlert({
                      title: "Vendor Deleted !",
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
                          let newVendors = [...this.state.allVendors]
                          newVendors.splice(index,1);
                          this.setState({
                            allVendors : newVendors
                          });
                      }
                  });
                })
                .catch( err=>{
                  console.log(err);
                });
              }
          });
  }

  openModel = ()=>{
    this.setState({ setModal : true });
  }
  closeModel = ()=>{
    this.setState({ setModal : false });
  }
  vendorChange =(e)=>{
    this.setState({ name : e.target.value });
    console.log(e.target.value);
  }
  imageChange = (e)=>{
    this.setState({ image : e.target.files[0] });
    // console.log(this.state.image);
  }

  vendorAdd =()=>{
    if(this.state.name === '') this.setState({ vendorError : true });
    else this.setState({ vendorError : false });

    if(this.state.name !== '' || this.state.image !== ''){
      var bodyFormData = new FormData();

      bodyFormData.set("name", this.state.name);
      bodyFormData.append("image", this.state.image);

    axios({
      method: "post",
      url: "/api/uploadVendor",
      data: bodyFormData,
      headers: { "Content-type": "multipart/form-data" }
      })
      .then(res => {
          console.log(res);
          this.setState({ setModal : false , image : '' });
          sweetAlert({
            title: "New Vendor Added !",
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
            this.setState( (prevState,props)=> {
              return {
                allVendors : [...prevState.allVendors , { name : prevState.name }],
                name : ''
              }
            });
          }
        });
      })
      .catch(err => {
        console.log(err);
        sweetAlert({
          title : 'Ops something went wrong !',
          icon : 'error',
        });
      });
    }
  }

  render() {
    if(this.state.allVendors.length === 0){
      return(
          <div style={{ marginTop : '25vh', marginLeft: '45vw' }} >
              <Rolling size={100} color='#00008b' />
          </div>
          )
    }
    else{
      return (
        <div className="container">
          <Modal isOpen={this.state.setModal}>
            <ModalHeader>
              <h4>Add new Vendor</h4>
            </ModalHeader>
            <ModalBody>
              <div className="row m-1">
                <div className="col-xs-12 col-sm-12 px-5">
                  <label className="font-weight-bold">Name</label>
                    <input type='text' onChange={ (e)=>{ this.vendorChange(e) } }
                    className= { classnames('form-control',{ 'is-invalid' : this.state.vendorError }) }
                     />
                </div>
                <div className="col-xs-12 col-sm-12 px-5">
                  <label className="mt-3 font-weight-bold">Image</label>
                    <input onChange={ (e)=> this.imageChange(e) } type='file' className='form-control-file' />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" outline onClick={this.closeModel}>
                Cancel
              </Button>
              <Button color="primary" outline onClick={ ()=>this.vendorAdd() }>
                Confirm
              </Button>
            </ModalFooter>
          </Modal>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <h2 className="my-3">Vendor(s) List</h2>
            </div>
            <div className="col-xs-12 col-sm-4">
              <button onClick={this.openModel} className="my-3 btn btn-success float-right">
                <i className="fas fa-plus"></i> Add New
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-10">
              <Table hover bordered>
                <thead>
                  <tr>
                    <th>S no.</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.allVendors.map((vendor,index) => {
                      return (
                        <tr key={index}>
                          <td>{ index+1 }</td>
                          <td>
                            {vendor.name}
                            <button
                              onClick={() => this.deleteVendor(vendor._id,vendor.name,index)}
                              className="float-right btn btn-danger">
                              <i className="fa fa-trash"></i> Delete Vendor
                            </button>
                          </td>
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

export default connect(mapStateToProps)(Vendors);
