import { makeStyles } from "@material-ui/core/styles";

export default function makeBackgroundDividerStyles() {
  return makeStyles(
    (theme) => {
      return {
        backgroundDivider: {
          width: "2px",
          height: "100%",
          backgroundColor: theme.palette.text.disabled,
          position: "relative",
          display: "flex",
          justifyContent: "center",
        },
        backgroundDividerLabel: {
          position: "absolute",
          bottom: -1 * theme.spacing(2),
          fontSize: "0.5rem",
        },
      };
    },
    { name: "BackgroundDivider" }
  );
}
