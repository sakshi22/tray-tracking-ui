import { FETCH_FACILITY_SUCCESS, CLOSE_FACILITY_POPUP,
    SAVE_FACILITY_SUCCESS, 
    OFFLINE_SWITCH_FACILITY} from '../actions/Types';

export const initialState = {
    allFacilities :[],
    showFacilityPopup:false,
    selectedFacilityId: -1,
    selectedFacilityName: '',
    showOfflineFacilityPopup:false,
}

export default (state = initialState, action) => {
    switch(action.type) {

        case FETCH_FACILITY_SUCCESS:

        let facilityId = -1;
        let facilityName = '';
        action.data.forEach((item, index)=> {
            if(item.selected)
            {
                facilityId = item.id;
                facilityName = item.name
            }
        })


            return {
                ...state,
                allFacilities: action.data,
                selectedFacilityId: facilityId,
                showFacilityPopup: true,
                selectedFacilityName: facilityName
            }

        case SAVE_FACILITY_SUCCESS:
            return {
                ...state,
                showFacilityPopup: false,
                selectedFacilityId: action.facility.id,
                selectedFacilityName:action.facility.name
            }    

        case CLOSE_FACILITY_POPUP:
        return {
            ...state,            
            showFacilityPopup: false,
            showOfflineFacilityPopup: false
        }
        case OFFLINE_SWITCH_FACILITY:
            return {
                ...state,
                showFacilityPopup: false,
                showOfflineFacilityPopup: false
            }
        default:
            return initialState;

    }
}