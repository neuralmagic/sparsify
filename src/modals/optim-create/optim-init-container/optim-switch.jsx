import React from "react";
import PropTypes from "prop-types";
import {
    Box,
    Switch,
    Typography,
} from "@material-ui/core"

import makeStyles from "../optim-create-styles";

const useStyles = makeStyles();

function OptimSwitch({ disabled, value, onChange, title, description }) {
    const classes = useStyles();
    
    return (<Box paddingY={1}>
        <Box display="flex" alignItems="top">
            <Box>
                <Switch disabled={disabled} color="primary" checked={value} onChange={() => onChange(!value)}/>
            </Box>
            <Box paddingTop={1}>
                <Typography className={disabled ? classes.disabledText : ""}>{title}</Typography>
                <Typography color="textSecondary" className={disabled ? classes.disabledText : ""}>
                    {description}
                </Typography>
            </Box>
        </Box>
    </Box>)
}

OptimSwitch.defaultProps = {
    disabled: false,
    value: false,
    onChange: () => {},
    title: "",
    description: ""
}

OptimSwitch.propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    onClick: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string,
}

export default OptimSwitch;