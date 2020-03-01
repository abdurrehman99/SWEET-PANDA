import React, { Component } from "react";
import { Link } from 'react-router-dom';
import './Showcase.css';
import {
  Card,
  CardText,
  CardBody,
  CardTitle,
} from "reactstrap";

class Bakery extends Component {
  render() {
    return (
      <div className="col-xs-12 col-sm-4 col-md-3 my-3" >
        <Card className='bakery-card'>
          <CardBody>
            <CardTitle>{this.props.name}</CardTitle> <img width='100%' style={{ borderRadius : '50%'}} height='100%' src={this.props.image} alt='img not found' />
              <CardText>{this.props.description}</CardText>
            <Link to='/itemlist' className='btn btn-outline-primary'>View Products</Link>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default Bakery;
