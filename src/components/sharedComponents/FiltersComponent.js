import React from "react";
import { Grid } from "@material-ui/core";

const FiltersComponent = (props) => {
    const defaultValue = parseInt('-1');
    const selectMenuClass = props.menuClass ? props.menuClass : "select-menu";

    return(
        <Grid>
            {
                props.filters.map((item, index) => {
                   const classes = item.class && item.class!==''? selectMenuClass+" "+item.class : selectMenuClass+" "
                    return (
                        <select onChange={props.onChange} value={item.value} name={item.name} className={classes}>
                        {item.showDefault!==false && <option disabled={item.disabled === true} hidden={item.disabled === true} value={item.disabled === true ? '' : defaultValue}>{item.default}</option> }
                        {item.optionArray && Array.isArray(item.optionArray) ?
                          item.optionArray.map((option) => {
                            return (
                              <option value={option.id}>{option.name}</option>);
                          }) : null
                        }
                      </select>
                  )

                })
            }
          </Grid>
    )
}
export default FiltersComponent;