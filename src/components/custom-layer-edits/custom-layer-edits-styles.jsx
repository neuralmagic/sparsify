import { makeStyles } from "@material-ui/core/styles";

export default function makeCustomLayerEditsStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FAF2CE",
          padding: theme.spacing(1),
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1),
          color: theme.palette.text.disabled
        },
        text: {
          fontSize: 14
        },
        button: {
          textTransform: 'none',
          fontSize: 14,
        }
      }
    },
    { name: "CustomLayerEdits" }
  );
}
