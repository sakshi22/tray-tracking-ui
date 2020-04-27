import React from "react";
import { TextField, InputAdornment } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { NUMBER } from "../../redux/actions/Constants";

const CustomSearchBar = (props) => {
    const startAdornment = <InputAdornment className="search-icon" position="start">
        <SearchIcon />
    </InputAdornment>
    const endAdornment =
        <InputAdornment style={{ display: props.display ? '' : 'none' }}
            onClick={props.clearSearch} className="search-icon search-clear-icon" position="end">
            <ClearIcon />
        </InputAdornment>
    const maxLength = props.maxLength ? props.maxLength : 50
    return (
        <TextField id="outlined-search"
            placeholder={props.placeholder}
            onChange={(e) => props.onChange(e)}
            className={props.class}
            autoComplete="off"
            inputProps={{
                maxLength:maxLength
            }}
            InputProps={props.type && props.type === NUMBER ? {
                startAdornment: startAdornment,
                endAdornment: endAdornment,
                type: 'tel',
            } : {
                    startAdornment: startAdornment,
                    endAdornment: endAdornment,
                }}
            name={props.name}
            value={props.value}
            variant="outlined" />
    )
}
export default CustomSearchBar;