//any actions  that we fire off will come here.
// out http requests come here.

import axios from 'axios';
import { GET_LEADS, DELETE_LEAD, ADD_LEAD, GET_ERRORS } from './types';
import errors from '../reducers/errors';

// GET LEADS
export const getLeads = () => (dispatch) => {
  axios
    .get('/api/leads/')
    .then((res) => {
      dispatch({
        type: GET_LEADS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

///DELETE LEAD
//export const deleteLead = (id) => (dispatch, getState) => {

export const deleteLead = (id) => (dispatch, getState) => {
  axios
  .delete(`/api/leads/${id}/`)    //.delete(`/api/leads/${id}/`, tokenConfig(getState))
  .then((res) => {
      //dispatch(createMessage({ deleteLead: 'Lead Deleted' }));
      dispatch({
        type: DELETE_LEAD,
        payload: id,
      });
    })
    .catch((err) => console.log(err));
};

// ADD LEAD
export const addLead = (lead) => (dispatch) => {
  console.log(lead) 
  axios
  .post('/api/leads/', lead)
  .then((res) => {
      dispatch({
        type: ADD_LEAD,
        payload: res.data,
      });
    })
    .catch(err=>console.log(err.response.data))  
  //   .catch((err) =>{
  //     const errors = {
  //     msg: err.response.data,
  //     status: err.response.status
  //   };
  //   dispatch({
  //     type:GET_ERRORS,
  //     payload: errors
  //   })
  // });   
};