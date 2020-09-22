import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

export default function createExportStyles() {
  return makeStyles((theme) => {
    return {
      contentHeader: {
        padding: theme.spacing(1, 0),
      },
      codeblock: {
        margin: theme.spacing(2, 0),
        maxHeight: "20vh",
        overflowY: "scroll",
        borderRadius: "5px",
        borderStyle: "solid",
        borderWidth: "thin",
        borderColor: grey[400],
      },
      select: {
        minWidth: "10vw",
      },
      textButton: {
        textTransform: "none",
        color: theme.palette.primary.main,
      },
      containedButton: {
        textTransform: "none",
      },
      anchorOverride: {
        textDecoration: "none",
        color: theme.palette.primary.main,
      },
      dialog: {
        padding: theme.spacing(2),
      },
    };
  });
}
