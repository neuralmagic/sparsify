import { makeStyles } from "@material-ui/core/styles";

export default function makeModifierRowStyles() {
  return makeStyles(
    (theme) => {
      return {
        modifier: {
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: theme.spacing(3),
          zIndex: 1,
        },
        modifierLabelContainer: {
          position: "absolute",
          left: 0,
          height: "100%",
        },
        modifierLabelWrapper: {
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center",
        },
        modifierLabel: {
          position: "absolute",
          right: theme.spacing(3),
        },
        modifierBackground: {
          width: "100%",
          height: theme.spacing(0.5),
          backgroundColor: theme.palette.divider,
        },
        modifierActive: {
          height: "100%",
          backgroundColor: theme.palette.primary.main,
        },
      };
    },
    { name: "ModifierRow" }
  );
}
