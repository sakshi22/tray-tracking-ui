import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
    <Route {...rest} render={(props) => (
      sessionStorage.getItem("jwtToken") 
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  const mapStateToProps = (state) =>({
        isAuthenticated:state.login.isAuthenticated
    });
  
  export default connect(
    mapStateToProps
  )(PrivateRoute);
  