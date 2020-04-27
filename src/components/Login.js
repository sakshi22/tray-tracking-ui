import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../style/styles";
import TextField from '@material-ui/core/TextField';
import "../style/index.css";
import "../css/main.css";
import { signIn, loginSuccess } from "../redux/actions/LoginAction";
import { connect } from "react-redux";
import { EMPTY_USERNAME_PASSWORD } from "../redux/actions/Constants";

class Login extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      emptyCredentials: true,
      signInAttempted: false,
    };
    this.signIn = this.signIn.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    if(!!sessionStorage.getItem('jwtToken')){
      this.props.loginSuccess(null,this.props.history);
    }
  }
  signIn = e => {
    e.preventDefault();
    if(this.state.userName === '' || this.state.password === '')
      this.setState({emptyCredentials: true, signInAttempted: true})
    else{
      this.setState({emptyCredentials: false, signInAttempted: true})
      var data = {
      userName: this.state.userName,
      password: this.state.password,
    };
    this.props.signIn(data, this.props.history);
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name] : e.target.value, signInAttempted: false });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="image_outer">       
        {this.props.loading && <div className="loader"><img alt="Loading. Please wait..." className="loading-gif" src={require("../images/loading.gif")}/></div>}
        <div className="login_box">
          <div className="logo_outer">
            <img alt="" src={require("../images/logo.svg")} />
          </div>
          <h1 styleName="text-align: center;">
            <span>My</span>Delivery
          </h1>
          <h4>Log into your account</h4>

          <form onSubmit={this.signIn} className={classes.container} noValidate autoComplete="off">
       

          <TextField
        id="outlined-userName-input"
        label="Username"
        type="Username"
        margin="normal"
        name="userName"
        variant="outlined"
        className="custum_input"
        value={this.state.userName} 
        onChange={this.handleChange.bind(this)}
        InputLabelProps={{shrink:true}}
      />
      <TextField
        id="outlined-password-input"
        label="Password"
        type="password"
        name="password"
        margin="normal"
        variant="outlined"
        className="custum_input"
        value={this.state.password}
        onChange={this.handleChange.bind(this)}
        InputLabelProps={{shrink:true}}
      />
          { this.state.emptyCredentials && this.state.signInAttempted &&
            <div><h5 style={{marginTop: '-16px', color: 'red',}}>{EMPTY_USERNAME_PASSWORD}</h5></div>
          }
          { this.props.errorMessage && this.props.errorMessage!=='' &&
            <div><h5 style={{marginTop: '-16px', color: 'red',}}>{this.props.errorMessage}</h5></div>
          }
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="button_login"
        >
            Sign in
        </Button>
        </form>
        <label className="link tooltip" title={`Implementation-Build:${process.env.REACT_APP_BUILD_VERSION} Build-Number:${process.env.REACT_APP_BUILD_NUMBER} Build-Time:${process.env.REACT_APP_TIMESTAMP}`} 
      	>2019 © Compass Group North America
    </label>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state)=>({
  isAuthenticated:state.login.isAuthenticated,
  errorMessage:state.login.errorMessage,
  loading: state.loader.loading,
});

const mapDispatchToProps = {
  signIn,
  loginSuccess
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Login));
