import {ADD_TO_CART} from '../actions/types';
import {FILL_CART} from '../actions/types';
import {REMOVE_CART} from '../actions/types';

const initialState = {
    mycart : [ ]
}

export default function(state = initialState, action){

    switch(action.type){
        case ADD_TO_CART:
            return {
                ...state,
                mycart : [...state.mycart, action.payload]
            }
        case FILL_CART:
            return {
                mycart : [...action.payload]
            }
        // case REMOVE_CART:
        //     return {
        //         // ...state,
        //         mycart : [...state.mycart].splice(action.payload,1)
        //     }
        default: 
            return state;
    }
}