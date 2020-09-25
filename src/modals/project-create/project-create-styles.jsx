import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectCreateStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          height: "80vh",
          maxHeight: "512px",
          display: "flex",
          flexDirection: "column",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          marginTop: theme.spacing(8),
          flex: "1 0",
        },
        swipable: {
          flex: "1 0",
        },
        swipableSlide: {
          width: "100%",
          height: "100%",
        },
        cancelButton: {
          color: theme.palette.text.secondary,
        },
        previousButton: {
          color: theme.palette.text.secondary,
          opacity: 1,
          transitionProperty: "opacity",
          transitionDuration: "0.2s",
        },
        previousButtonHidden: {
          opacity: 0,
        }
      };
    },
    { name: "ProjectCreateDialog" }
  );
}
