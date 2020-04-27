import React, { Component } from "react";
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
//import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,

        },
        closeButton: {
            position: 'absolute',
            color: theme.palette.grey[500],
        },
    });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={props.children === 'Change Facility' ? "facility-change-popup" :"popup-header"}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className="close-btn" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
    },
}))(MuiDialogContent);

/*const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
    },
}))(MuiDialogActions);*/

export default class CustomizedDialogs extends Component {
    constructor(props) {
        super(props);
        //this.openCartSummary = this.openCartSummary.bind(this)
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.onAccept = this.onAccept.bind(this);
        this.onReject = this.onReject.bind(this);
    }
    
    handleClickOpen() {
        this.props.handleClickOpen();
    };
    handleClose() {
        this.props.handleClose()
    };


    onAccept() {
        this.props.onAccept();
    }

    onReject() {
        this.props.handleClose()
    }

    render() {


        return (       
            <div>
                <Dialog style={{zIndex:'99999999999999999999'}} disableBackdropClick={true} 
                    onClose={this.props.showBackButton ? "" : this.handleClose} fullScreen={this.props.fullScreen}
                className={this.props.customClassName ? this.props.customClassName : (!this.props.fullScreen ? "popup-sm-width" : "")}
                aria-labelledby="customized-dialog-title" open={this.props.open}>
                    <DialogTitle onClose={this.props.showBackButton ? "" : this.handleClose} className="title-style">
                        {this.props.showBackButton ?
                            <div><button onClick={this.handleClose}
                                className="back_button_popup">
                            <ArrowBackIosIcon style={{color: "white",fontSize: "35px", position: 'relative', left: '5.5px', top: '1px'}} />
                            </button>   <span style={{ marginLeft: '42px' }}>{this.props.dialogTitle}</span></div>
                            : this.props.dialogTitle}
                    </DialogTitle>
                    <DialogContent dividers style={{ 'padding': '0px' }}>
                    {!this.props.showButtons && 
                        this.props.dialogContent}
                        {this.props.showButtons && 
                        <h3>{this.props.dialogContent}</h3>}
                        {this.props.showButtons &&
                            <div className="popup-button" >
                                <Button variant="contained" color="primary" className="cart-departed active"
                                    onClick={this.onAccept}
                                >{this.props.acceptBtn}</Button>

                                <Button variant="contained" color="primary" className="cart-departed active"
                                    onClick={this.onReject}
                                >{this.props.rejectBtn} </Button>

                            </div>
                        }
                        {this.props.showOnlyOkButton &&
                            <div className="popup-button" style={{margin:'auto'}} >
                                <Button variant="contained" color="primary" className="cart-departed active"
                                    onClick={this.handleClose}
                                >Ok</Button>
                            </div>
                        }

                        { this.props.showInfoMessage &&
                            <label className="popup-footer">You are confirming that all <u> high risk </u> trays in this cart have been verified. </label>
                        }
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

CustomizedDialogs.defaultProps = {
    acceptBtn : 'Yes',
    rejectBtn : 'No'
}