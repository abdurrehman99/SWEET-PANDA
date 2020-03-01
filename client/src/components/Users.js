import React, { Component } from 'react';
import axios from 'axios';
import { Rolling } from "react-loading-io";
import { Link } from "react-router-dom";
import { Table } from 'reactstrap';
import sweetAlert from 'sweetalert';
import classnames from 'classnames';
import validator from 'validator';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class Users extends Component {
    constructor(props){
        super(props);
        this.state = {
            setModal : false,
            allUsers : [],
            id : '',
            name : '',
            email : '',
            mobileNo : '',
            nameError : false,
            emailError : false,
            mobileNoError : false,
            index : 0
        }
    }
    componentDidMount(){
        if(this.props.auth.user.email !== 'admin@sweetpanda.com'){
            this.props.history.push('/');
        }

        axios.get('/api/getAllUsers')
            .then( res=>{
                this.setState({ allUsers : res.data });
                console.log(res.data);
            })
            .catch( err=>{
                console.log(err);
            });
    }

    deleteUser = (email,name,index) =>{
        if(email === 'admin@sweetpanda.com'){
            sweetAlert({
                icon : 'warning',
                title : 'Cannot delete Admin !',
                closeOnClickOutside: false
            });
        }
        else{
            sweetAlert({
                title: `Are you sure want to delete\n"${name}" ?`,
                icon: "error",
                buttons: ["No", "Yes"],
                dangerMode: true,
                closeOnClickOutside: false
              })
                .then( willDelete => {
                    if (willDelete) {
                        axios.post('/api/deleteUser/'+email)
                        .then( res=>{
                            console.log(res);
                            sweetAlert({
                                title: "User Deleted !",
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
                                    let newUsers = [...this.state.allUsers];
                                    newUsers.splice(index,1);
                                    this.setState({
                                        allUsers : newUsers
                                    })
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
    
                }); 
        }
    }
    openEdit = (name,email,mobileNo,id,index)=>{ 
        if(email === 'admin@sweetpanda.com'){
            sweetAlert({
                icon : 'warning',
                title : 'Cannot edit Admin !',
                closeOnClickOutside: false
            });
        }
        else{
            this.setState({ 
                name ,
                email ,
                mobileNo ,
                id,
                setModal : true ,
                index
            });

        }
    }
    confirmEdit = ()=>{
        if(this.state.emailError === true || this.state.nameError === true || this.state.mobileNoError === true ){
            
        }
        else{
            sweetAlert({
                title: "Confirm Change(s) ?",
                icon: "warning",
                buttons: ["No", "Yes"],
                closeOnClickOutside: false
              })
              .then( willEdit => {
                if(willEdit){
                    console.log(this.state.name,this.state.email,this.state.mobileNo);
                    let data = {
                        _id : this.state.id,
                        fullName : this.state.name,
                        email : this.state.email,
                        mobileNo : this.state.mobileNo
                    }
                    axios.post('/api/editUser',data)
                        .then(res=> {
                            console.log(res);
                            this.setState({ setModal : false });
                            sweetAlert({
                                title: "User Info Edited !",
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
                                    let newUsers = [...this.state.allUsers];
                                    newUsers[this.state.index] = {
                                        fullName : this.state.name,
                                        email : this.state.email,
                                        mobileNo : this.state.mobileNo
                                    }
                                    this.setState({
                                        allUsers : newUsers
                                    });
                                }
                            });
                        })
                        .catch(err=> console.log(err));
                }
              });
        }
    }
    closeModel = ()=>{
        this.setState({ 
            setModal : false ,
            id : '',
            name : '',
            email : '',
            mobileNo : '',
            nameError : false,
            emailError : false,
            mobileNoError : false
            
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
    emailChange = (e)=>{
        let em = validator.isEmail(e.target.value);
        console.log(em);
        console.log(e.target.value);
        if(e.target.value === '' || em === false) this.setState({ emailError : true });
        else this.setState({ 
            email : e.target.value,
            emailError : false, 
        });
    }
    mobileNoChange = (e)=>{
        const mobileRegex = /^03[0-9]{9}$/;
        let re = mobileRegex.test(e.target.value);
        console.log(re);
        console.log(e.target.value);
        if(e.target.value === '' || re === false) this.setState({ mobileNoError : true });
        else this.setState({ 
            mobileNo : e.target.value,
            mobileNoError : false,
         });
    }
    render() {
        if(this.state.allUsers.length === 0){
            return(
                <div style={{ marginTop : '25vh', marginLeft: '45vw' }} >
                    <Rolling size={100} color='#00008b' />
                </div>
            )
        }
        else{
            return (
                <div className='container'>
                    <Modal isOpen={this.state.setModal}>
                        <ModalHeader><h4>Edit User</h4></ModalHeader>
                            <ModalBody>
                                <div className="row m-1">
                                    <div className="col-xs-12 col-sm-12">
                                        <label className="font-weight-bold">Name</label>
                                        <input type='text' 
                                        className= { classnames('form-control mb-2',{ 'is-invalid' : this.state.nameError }) } defaultValue={this.state.name} 
                                        onChange={ (e)=>{ this.nameChange(e)} } />
                                    </div>
                                    <div className="col-xs-12 col-sm-12">
                                        <label className="font-weight-bold">Email</label>
                                        <input type='text' 
                                        className= { classnames('form-control mb-2',{ 'is-invalid' : this.state.emailError }) }
                                        defaultValue={this.state.email} 
                                        onChange={ (e)=>{ this.emailChange(e)} } />
                                    </div>
                                    <div className="col-xs-12 col-sm-12">
                                        <label className="font-weight-bold">Mobile No</label>
                                        <input type='text' 
                                        maxLength='11' 
                                        className= { classnames('form-control mb-2',{ 'is-invalid' : this.state.mobileNoError }) }
                                        defaultValue={this.state.mobileNo}  
                                        onChange={ (e)=>{ this.mobileNoChange(e)} } />
                                    </div>
                                </div>
                            </ModalBody>
                        <ModalFooter>
                        <Button color="secondary" outline onClick={this.closeModel}>Cancel</Button>
                        <Button color="primary" outline onClick={this.confirmEdit}>Confirm</Button>
                        </ModalFooter>
                    </Modal>
                    <div className="row">
                        <div className="col-xs-12 col-sm-8">
                            <h2 className='my-3'>User(s) Registerd on Sweet Panda</h2>
                        </div>
                        <div className="col-xs-12 col-sm-2">
                            <Link to='/adminPanel' className='my-3 btn btn-primary float-right'><i className="fas fa-chevron-left"></i> Go Back</Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-sm-10">
                            <Table hover bordered >
                                <thead>
                                    <tr>
                                        <th>S no.</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody> 
                                    { this.state.allUsers.map( (user,index)=>{
                                        return (
                                            <tr>
                                                <td>{ index+1 }</td>
                                                <td>{ user.fullName }</td>
                                                <td>{ user.email }<button onClick={ ()=>this.deleteUser(user.email,user.fullName,index) } className='float-right btn btn-danger'><i className='fa fa-trash'></i> Delete User</button><button onClick={ ()=> this.openEdit(user.fullName,user.email,user.mobileNo,user._id,index) } className='float-right btn btn-primary mx-2'><i className='fa fa-edit'></i> Edit User</button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
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

export default  connect(mapStateToProps)(Users);
