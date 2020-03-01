import {ADD_VENDOR} from '../actions/types';

const initialState = {
    vendors : []
}

export default function(state = initialState, action){
    switch(action.type){
        case ADD_VENDOR:
            return {
                // ...state,
                vendors : [...action.payload]
            }
        default: 
            return state;
    }
}
