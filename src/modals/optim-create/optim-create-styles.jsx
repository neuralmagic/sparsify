import { makeStyles } from "@material-ui/core/styles";

export default function createOptimStyles() {
    return makeStyles((theme) => {
        return {
            disabledText: {
                color: theme.palette.text.disabled
            },
            button: {
                textTransform: "none"
            },
            cancelButton: {
                color: theme.palette.text.secondary
            },
            inputFields: {
                margin: theme.spacing(1, 2, 1, 0)
            },
            dialog: {
                minWidth: "600px",
                padding: theme.spacing(2)
            },
            noPresetsLabel: {
                verticalAlign: "middle"
            }
        }
    })
}
