import React from 'react';
import ReactDOM from 'react-dom';
import AppRoute from './AppRoute';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import RootReducer from './redux/reducers/RootReducer';
import { HashRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import history from './services/history';
import {post} from './services/httpService';

var timeoutHandle;
const customMiddleware = ({dispatch, store}) => next => action => {
    let setTimer = function() {
        if(!!timeoutHandle)
        {
            clearTimeout(timeoutHandle);    
            timeoutHandle = null;
        }
        timeoutHandle = setTimeout(function() {
        	post({
                url:'/traytracking/doLogout',
                mock: false
            }).then((response)=>{  
	            sessionStorage.removeItem('jwtToken');
	            window.location.reload();  
                dispatch({type:"LOGOUT"});
            }).catch((e)=>{
                console.log("Error while trying to log out.");
            })       
        }, 3.6e+6);
    }
    setTimer();
    next(action);
}



const store = createStore(RootReducer, applyMiddleware(thunk, customMiddleware));

window.store = store;
ReactDOM.render(
    <Provider store ={store}>        
        <Router history={history}
        //  basename={process.env.REACT_APP_ROUTER_BASE || ''}
        >
            <div>
                <AppRoute />
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);

//serviceWorker.register();
navigator.serviceWorker && navigator.serviceWorker.register('./sw.js').then(function(registration) {
    console.log('Service worker registration successful');
  }).catch(function(error) {
      console.log('Service worker registration failed, error:', error);
  });