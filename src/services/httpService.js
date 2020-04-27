import axios from 'axios';

export const get = async ({url, params, mock}) => 
{
    params = {
        headers: {
            Authorization: (sessionStorage.getItem("jwtToken") == null ? '' : "Bearer "+ sessionStorage.getItem("jwtToken"))
         }
      }
    if(mock){

    }else{
    	try {
    		 let response = await axios.get(url, params);
    	     return response;
    	}
		catch(err) {
			
			if(err.response && err.response.status === 401)
			{			
				sessionStorage.removeItem("jwtToken"); 
				window.location.reload();
			}
			else{
				throw err;
			}
		}
       
    }
}

export const post = async ({url, data, mock}) => 
{
    debugger;
    if(mock){
        return Promise.resolve({
            data: {
                patientName: 'abc' 
            }
          });
    }else{
        debugger;
        let config={
            headers:{"Authorization": (sessionStorage.getItem("jwtToken") == null ? '' : "Bearer "+ sessionStorage.getItem("jwtToken") )}
        }
        try {
        	let response = await axios.post(url, data, config);
   	        return response;
        }
		catch(err) {
			if(!url.includes('doLogin') && err.response && err.response.status === 401)
			{			
				sessionStorage.removeItem("jwtToken"); 
				window.location.reload();
			}
			else{
				throw err;
			}
		}
       
    }
}

// export default axios;