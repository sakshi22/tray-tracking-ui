import { combineReducers } from 'redux';
import login from './LoginReducer';
import inCartReducer from './InCartReducer';
import departReducer from './DepartReducer';
import deliverReducer from './DeliveredReducer'; 
import recoverReducer from './RecoveredReducer'; 
import navigation from './NavigationReducer'; 
import loader from './LoadingReducer';
import dropDown from './DropDownReducer';
import unitTrackingReducer from './UnitTrackingReducer';
import offlineIndicator from './OfflineIndicatorReducer';
import highRiskTrayCheckReducer from './HighRiskTrayCheckReducer';

const RootReducer = combineReducers({
    login,
    inCartReducer,
    departReducer,
    navigation,
    deliverReducer,
    recoverReducer,
    loader,
    dropDown,
    offlineIndicator,
    highRiskTrayCheckReducer,
    unitTrackingReducer,
});

export default RootReducer;