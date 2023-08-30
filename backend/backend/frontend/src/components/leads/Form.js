import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addLead } from '../../actions/leads';

class Form extends Component {
  
  //initial state 
  state = {
    name: '',
    email: '',
    message: '',
    gender: '', 
    image: null, 

  };

  
  static propTypes = {
    addLead: PropTypes.func.isRequired,
  };

  onChange = (e) => {
    if (e.target.name === 'image') {
      this.setState({ [e.target.name]: e.target.files[0] }); // Handle file input
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  

  onSubmit = (e) => {
    e.preventDefault();
    const { name, email, message, gender, image } = this.state;
    const lead = { name, email, message, gender, image };

    this.props.addLead(lead);
    this.setState({
      name: '',
      email: '',
      message: '',
      gender: '',
      image: null,
    });

  };


  render(){
  
    const { name, email, message, gender, image } = this.state;
    return (

      <div className="card card-body mt-4 mb-4">
        <h2>Add Lead</h2>
        <form onSubmit={this.onSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              onChange={this.onChange}
              value={name}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              onChange={this.onChange}
              value={email}
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              className="form-control"
              type="text"
              name="message"
              onChange={this.onChange}
              value={message}
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              className="form-control"
              name="gender"
              onChange={this.onChange}
              value={gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image</label>
            <input
              className="form-control"
              type="file"
              name="image"
              onChange={this.onChange}
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    
    )
  };


}

export default connect( null, { addLead } )(Form);

//here we are using null instead of mapstoprop as we did in in the leasd.js 
// it is because this component is related to adding data (POST method)
// we dont need to fetch any existing data present so thats why we just fill the parameter with null.