import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwtDecode from "jwt-decode";
// import { decode } from "jsonwebtoken";
import sweetAlert from "sweetalert";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      history.push("/login");
      sweetAlert({
        title: "You are successfully registered to Sweet Panda !",
        icon: "success"
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//FB login Route
// export const fbLogin = res => dispatch =>{

//     //get token form response
//     const { accessToken } = res;

//     //Save to local storage
//     localStorage.setItem("jwtToken", "Bearer "+accessToken);
    
//     //decode token to get data
//     const decoded = jwtDecode(accessToken);
//     //set current user
//     dispatch(setCurrentUser(decoded));
//     sweetAlert({
//       title: "You are now logged in to Sweet Panda !",
//       icon: "success"
//     });
// }

//Login & get Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //get token form response
      const { token } = res.data;
      //Save to local storage
      localStorage.setItem("jwtToken", token);
      //set token to AUTH header
      setAuthToken(token);
      //decode token to get data
      const decoded = jwtDecode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
      if(res.data.email === "admin@sweetpanda.com") {
        sweetAlert({
          title: "You are logged in as Admin !",
          icon: "info",
          closeOnClickOutside : false
        });
      }
      else{
        sweetAlert({
          title: "You are now logged in to Sweet Panda !",
          icon: "success"
        });
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};


//Set Current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out
export const logoutUser = () => dispatch => {
  sweetAlert({
    title: "Are you sure want to logout ?",
    icon: "warning",
    buttons: ["No", "Yes"],
    dangerMode: true,
    closeOnClickOutside: false
  }).then(willDelete => {
    if (willDelete) {
      //Remove token from local storage
      localStorage.removeItem("jwtToken");

      //remove auth header
      setAuthToken(false);

      //Clear cart 
      localStorage.removeItem('cart');

      //Set current user to { } & isAuthenticated : false
      dispatch(setCurrentUser({}));
      window.location.replace('/');
    }
  });
};
