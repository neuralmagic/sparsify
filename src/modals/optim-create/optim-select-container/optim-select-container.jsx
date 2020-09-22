import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    Box,
    Button,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@material-ui/core";
import makeStyles from "../optim-create-styles";
import useOptimSettingsState from "../hooks/optim-settings-hooks";

const useStyles = makeStyles();

function OptimSelectContainer({ onCancel, onPrevious, onNext}) {
    const {
        optimizer,
        setOptimizer,
        initLR,
        setInitLR,
        finalLR,
        setFinalLR,
        epochs,
        setEpochs
    } = useOptimSettingsState();
    const classes = useStyles();

    return (
        <DialogContent>
            <Box marginY={2}>
                <Typography>
                    What optimizer did you use to train your model?
                </Typography>
                <FormControl className={classes.inputFields} fullWidth variant="outlined" >
                    <InputLabel id="optim-select-label">Select an optimizer</InputLabel>
                    <Select
                        value={optimizer}
                        onChange={(event) => setOptimizer(event.target.value)}
                        labelId="optim-select-label"
                        label="Select an optimizer"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"SGD"}>
                            SGD
                        </MenuItem>
                        <MenuItem value={"Adam"}>
                            Adam
                        </MenuItem>
                        <MenuItem value={"RMSprop"}>
                            RMSprop
                        </MenuItem>
                        <MenuItem value={"AdaGrad"}>
                            AdaGrad
                        </MenuItem>
                        <MenuItem value={"Momentum"}>
                            Momentum
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box marginY={2}>
                <Typography>
                    Learning rate range
                </Typography>
                <Box>
                    <TextField
                        className={classes.inputFields}
                        variant="outlined"
                        label="Initial LR"
                        value={initLR}
                        onChange={(event) => {
                            setInitLR(event.target.value);
                        }}
                    />
                    <TextField
                        className={classes.inputFields}
                        variant="outlined"
                        label="Final LR"
                        value={finalLR}
                        onChange={(event) => {
                            setFinalLR(event.target.value);
                        }}
                    />
                </Box>
            </Box>
            <Box marginY={2}>
                <Typography>
                    Epochs to train
                </Typography>
                <Box>
                    <TextField
                        className={classes.inputFields}
                        variant="outlined"
                        label="Epochs"
                        value={epochs}
                        onChange={(event) => {
                            setEpochs(event.target.value);
                        }}
                    />
                </Box>
            </Box>
            <Box paddingY={3} display="flex" justifyContent="flex-end" alignItems="center">
                <Box paddingRight={1}>
                    <Button
                        onClick={() => onCancel()}
                        className={`${classes.button} ${classes.cancelButton}`}
                    >
                        Cancel
                    </Button>
                </Box>
                <Box marginRight={1}>
                    <Button
                        onClick={() => onPrevious()}
                        color="secondary"
                        variant="contained"
                        className={classes.button}
                    >
                        Previous
                    </Button>
                </Box>
                <Box>
                    <Button
                        onClick={() => onNext()}
                        color="secondary"
                        variant="contained"
                        className={classes.button}
                    >
                        Apply
                    </Button>
                </Box>
            </Box>  
        </DialogContent>
    )
}

OptimSelectContainer.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired
}

export default OptimSelectContainer;