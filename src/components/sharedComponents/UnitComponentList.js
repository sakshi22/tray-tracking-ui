import React from "react";
import UnitComponent from "./UnitComponent";

const UnitComponentList = (props) => {
    if (props.units && Array.isArray(props.units) && props.units.length > 0) {
        return props.units.map((item, index) => (
            <UnitComponent
                handleClick={props.handleClick}
                key={index}
                unit={item}
                active={props.selectedUnit && props.selectedUnit.id && props.selectedUnit.id === item.id}
                isUndoEnable={props.enableUndo}
                onUndo={props.onUndo}
            />
        ));
    } else {
        return (
            <div>{props.emptyListMessage}</div>
        )
    }
}
export default UnitComponentList;