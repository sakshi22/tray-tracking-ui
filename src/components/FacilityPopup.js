import React from "react";
import CheckIcon from '@material-ui/icons/Check';

const FacilityPopup = ({ facilities, saveDafaultFacility, selectedFacilityId }) => {

        if(facilities && Array.isArray(facilities)) {
            return facilities.map((facility, index) => (
                
                <li id={facility.id} className={selectedFacilityId === facility.id ? "selected-facility" : (index %2 === 0 ? "even" : "odd")}
                    onClick={() => saveDafaultFacility(facility)}>
                   <div className="facility-name">{facility.name} </div>
                   {
                        (selectedFacilityId === facility.id) && <CheckIcon className="facility-check"/>
                    }
                </li>
            ));
        }
}

export default FacilityPopup;