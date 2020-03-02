import {ADD_TO_CART} from './types';
import {FILL_CART} from './types';
import {REMOVE_CART} from './types';

export const addToCart = (item) => {
    return {
        type : ADD_TO_CART, 
        payload : item
    }
}

export const removeFromCart = (item) => {
    return {
        type : REMOVE_CART, 
        payload : item
    }
}

export const fillCart = (item) => {
    return {
        type : FILL_CART, 
        payload : item
    }
}

