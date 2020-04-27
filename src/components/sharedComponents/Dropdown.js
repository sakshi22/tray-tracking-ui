import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DomainIcon from '@material-ui/icons/Domain';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    padding:'0px;'
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    '&:focus': {
      backgroundColor:'#007c94', color:'#fff',
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: '#fff',
      },
    },
  },
}))(MenuItem);

export default function CustomizedMenus(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function openChangeFacility() {
    setAnchorEl(null);
    props.switchFacility();
  }

  return (
    <div className="dropdown"> 
  <IconButton className="dropdown_Icon"
        aria-label="More"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <KeyboardArrowDownIcon />
      </IconButton>

      <div className="selected-facility-name">
        {props.selectedFacilityName}
        </div>
      
      <StyledMenu
       className="MenuStyle"
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        disableAutoFocusItem
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
      <StyledMenuItem style={{display: 'none'}} className="menuItem">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary=""/>   
        </StyledMenuItem>
        <StyledMenuItem onClick={openChangeFacility} className="menuItem">
          <ListItemIcon>
            <DomainIcon />
          </ListItemIcon>
          <ListItemText primary="Change Facility"/>   
        </StyledMenuItem>
        <StyledMenuItem onClick={props.logOut} className="menuItem">
        <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out"/>          
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}
