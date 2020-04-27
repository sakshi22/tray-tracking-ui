import React from "react";

const UnitComponent = (props) => {
  return (
    <div id={props.unit.id} onClick={() => props.handleClick(props.unit, props.isUndoEnable)}
      className={props.active ? 'unit-list order-detail-list active' : 'unit-list order-detail-list'}>
      {
        props.isUndoEnable ?
          <div className="tray-delivered">
            <button onClick={() => props.onUndo(props.unit)} className="unit-list-undo undo-bttn">Undo	</button>
          </div> : null
      }
      <div className="unit_tile_text">
        <div className={props.isUndoEnable ? "undo-unit-name" : ""}>
        <span className=".text-ellipsis-word-wrap" style={{ maxWidth: '90%' }}>{props.unit.name}</span>
        </div>
      </div>

    </div>
  );
}
UnitComponent.defaultProps = {
  active: false,
  isUndoEnable: false,
};
export default UnitComponent;