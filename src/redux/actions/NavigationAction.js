import history from '../../services/history'; 
import {post} from '../../services/httpService';

export const changeRoute = (url) => {
    return (dispatch) => {
        dispatch({type:"PUSH", url})
    }
}
