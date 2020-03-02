import {ADD_VENDOR} from '../actions/types';

const initialState = {
    vendorsList : []
}

export default function(state = initialState, action){
    switch(action.type){
        case ADD_VENDOR:
            return {
                vendorsList : [...action.payload]
            }
        default: 
            return state;
    }
}
