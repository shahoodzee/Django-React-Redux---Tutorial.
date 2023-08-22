import { GET_LEADS, DELETE_LEAD, ADD_LEAD, CLEAR_LEADS } from '../actions/types.js';

const initialState = {
    //OTHER VARIABLES                                                             <------------
  leads: [],                                             //                                   |
};                                                       //                                   | 
                                                         //                                   |    
export default function (state = initialState, action) { //                                   |      
    switch (action.type) { //                                                                 |  
      case GET_LEADS:  //                                                                     |
        return {       //                                                                     |      
          ...state, // we using (...) with cuz we wanna return everything thats with leads-___|
          leads: action.payload,
        };

      case DELETE_LEAD:
        return {
          ...state,
          leads: state.leads.filter((lead) => lead.id !== action.payload),
        };

      case ADD_LEAD:
        return {
          ...state,
          leads: [...state.leads, action.payload], //This code means any leads that are already present we gotta add a new payload along which is a new lead.
        };
        
      case CLEAR_LEADS:
        return {
          ...state,
          leads: [],
        };

      default:
        return state;
    }
  }