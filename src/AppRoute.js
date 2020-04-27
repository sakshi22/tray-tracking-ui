import React from 'react';
import Login from './components/Login';
import TrayEvents from './components/TrayEvents';
import InCart from './components/InCart';
import Departure from './components/Departure';
import DepartedSummary from './components/DepartedCart';
import Delivered from './components/Delivered';
import History from './components/sharedComponents/History';
import PrivateRoute from './PrivateRoute';
import { Route, Switch, Redirect } from "react-router-dom";
import Recovered from './components/Recovered';
import UnitDeliveryTracking from './components/UnitDeliveryTracking';
import UnitRecoveryTracking from './components/UnitRecoveryTracking';
import CartSummary from './components/CartSummary';
import OfflineIndicator from './components/OfflineIndicator';
import HighRiskTrayCheck from './components/HighRiskTrayCheck';

const AppRoute = () => (
  <Switch>
    <History>  
      <OfflineIndicator>
        <Route path='/login' component={Login} name ="login"/>  
        <PrivateRoute path="/trayEvents" component={TrayEvents} name="trayEvents"/>
        <PrivateRoute path="/inCart" component={InCart} name="inCart"/>
        <PrivateRoute path="/departure" component={Departure} name="departure" />
        <PrivateRoute path="/departCartSummary" component={DepartedSummary} name="departedSummary"/>
        <PrivateRoute path="/delivered" component={Delivered} name="delivered" />
        <PrivateRoute path="/recovered" component={Recovered} name="recovered" />
        <PrivateRoute path="/cartSummary" component={CartSummary} name="cartSummary" />
        <PrivateRoute path="/unitDeliveryTracking" component={UnitDeliveryTracking} name="unitDeliveryTracking" />
        <PrivateRoute path="/unitRecoveryTracking" component={UnitRecoveryTracking} name="unitRecoveryTracking" />
        <PrivateRoute path="/highRiskTrayCheck" component={HighRiskTrayCheck} name="highRiskTrayCheck" />
        <Redirect to="/login" />
      </OfflineIndicator>
    </History>
  </Switch>
)

export default AppRoute;