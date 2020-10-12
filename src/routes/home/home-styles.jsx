import { makeStyles } from "@material-ui/core/styles";
import zIndex from "@material-ui/core/styles/zIndex";

export default function createHomeStyles() {
  return makeStyles(
    (theme) => {
      const paddingButton = theme.spacing(3);
      const positionButton = theme.spacing(4);

      return {
        fab: {
          position: "fixed",
          right: `${positionButton}px`,
          bottom: `${positionButton}px`,
          padding: `${paddingButton}px`,
        },
        fabIcon: {
          marginRight: theme.spacing(1),
        },
        info: {
          top: "0px",
          right: "0px",
          position: "absolute",
          margin: theme.spacing(0.5),
          zIndex: 10,
        },
        infoButton: {
          padding: 0,
          margin: 0,
          "& svg": {
            fill: theme.palette.text.secondary,
            width: "32px",
            height: "32px",
          },
        },
      };
    },
    { name: "Home" }
  );
}
