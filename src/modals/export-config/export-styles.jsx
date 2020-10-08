import { makeStyles } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";

export default function createExportStyles() {
  return makeStyles(
    (theme) => {
      return {
        contentHeader: {
          padding: theme.spacing(1, 0),
        },
        container: {
          height: "24vh",
          width:"770px",
          overflow: "hidden",
          margin: theme.spacing(2, 0),
        },
        otherblock: {
          height: "20vh",
          width: "750px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        codeblock: {
          height: "20vh",
          width: "750px",
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
          color: theme.palette.primary.main,
        },
        containedButton: {
        },
        anchorOverride: {
          textDecoration: "none",
          color: theme.palette.primary.main,
        },
        dialog: {
          padding: theme.spacing(2),
          width: "800px",
        },
      };
    },
    { name: "ExportConfig" }
  );
}
