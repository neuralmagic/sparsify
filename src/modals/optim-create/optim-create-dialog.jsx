import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
} from "@material-ui/core";
import OptimInitContainer from "./optim-init-container";
import OptimSelectContainer from "./optim-select-container";
import makeStyles from "./optim-create-styles";

const useStyles = makeStyles();

function OptimCreateDialog({ open, handleClose }) {
    const [ modalView, setModalView ] = useState(0);
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={() => handleClose()} maxWidth="sm" PaperProps={{className: classes.dialog}} >
            <DialogTitle>Model Optimization Settings</DialogTitle>
            {modalView === 0 && <OptimInitContainer onCancel={() => handleClose()} onNext={() => setModalView(1)}/>}
            {modalView === 1 && <OptimSelectContainer onCancel={() => handleClose()} onPrevious={() => setModalView(0)} onNext={() => {}}/>}
        </Dialog>
    )
}

OptimCreateDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func,
}

export default OptimCreateDialog;