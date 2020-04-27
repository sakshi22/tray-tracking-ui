 export const initialState = {
    url: "/doLogin"
 };

 export default (state = initialState, action) => {
    switch (action.type) {
        case "PUSH":
            return {...state, url:action.url}
        default: 
            return state;
    }    
 }  