var React = require('react');

//messages
export const MARK_CART_CHECKED = <span>You are confirming all <u> HIGH RISK </u> trays in this cart have been verified. Would you like to mark this cart ready for departure?</span>
export const ERROR_WHILE_HIGH_RISK_CHECK_TITLE = <div style={{fontWeight: '500'}}>Error while checking for high risk !</div>
export const ERROR_WHILE_HIGH_RISK_CHECK_MESSAGE = <div style={{margin: '15px'}}>The Cart cannot be checked for high risk at this time. Please try again later.</div>
export const MARK_CART_DEPARTED = <div className="pull-left" style={{margin: '0px 0px 0px 20px'}}><span>Are you sure you want to mark this cart as departed?</span><br/><span>You are confirming <u> HIGH RISK </u> trays added to the cart have been checked.</span></div>