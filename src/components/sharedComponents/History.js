import React, { Component } from "react";
import { connect } from 'react-redux';

class History extends Component {

  componentDidUpdate(next) {  
        if(this.props.route !== next.route){
            // this.props.history.push(next.route)
        }
    }

  render() {
    return (
        <React.Fragment>
            {this.props.children}
        </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
    route:state.navigation.url
})


export default connect(mapStateToProps, null)(History);