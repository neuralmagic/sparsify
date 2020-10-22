import { makeStyles } from "@material-ui/core/styles";

export default function makeBackgroundSectionStyles() {
  return makeStyles(
    (theme) => {
      return {
        backgroundSection: {
          position: "relative",
          display: "flex",
          justifyContent: "center",
        },
        backgroundSectionLabelContainer: {
          position: "absolute",
          bottom: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        backgroundSectionLabel: {
          fontSize: "0.7rem",
        },
        backgroundSectionLabelTick: {
          width: "1px",
          height: theme.spacing(1),
          backgroundColor: theme.palette.divider,
        },
        backgroundSectionFill: {
          flex: "1 0",
        },
      };
    },
    { name: "BackgroundSection" }
  );
}
