//any actions  that we fire off will come here.
// out http requests come here.

import axios from 'axios';
import { GET_LEADS, DELETE_LEAD, ADD_LEAD } from './types';

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
export const deleteLead = (id) => (dispatch, getState) => {
  axios
  //.delete(`/api/leads/${id}/`, tokenConfig(getState))
  .delete(`/api/leads/${id}/`)
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
export const addLead = (lead) => (dispatch, getState) => {
  axios
  //.post('/api/leads/', lead, tokenConfig(getState))
  .post('/api/leads/', lead)
  .then((res) => {
    //dispatch(createMessage({ addLead: 'Lead Added' }));
    dispatch({
        type: ADD_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};