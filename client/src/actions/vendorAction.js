import {ADD_VENDOR} from './types';

export const addVendor = (vendor) => {
    return {
        type : ADD_VENDOR, 
        payload : vendor
    }
}
