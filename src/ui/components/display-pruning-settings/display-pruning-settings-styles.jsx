import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayPruningSettingsStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          flexDirection: "column",
          marginBottom: theme.spacing(2),
        },
        label: {
          marginBottom: theme.spacing(2),
        },
        sparsityContainer: {
          display: "flex",
          alignItems: "center",
          width: "100%",
        },
        slider: {
          flex: "1 0",
          width: 0,
        },
        settingsButton: {
          marginLeft: theme.spacing(2),
        },

        popoverRoot: {
          padding: theme.spacing(2),
          width: "256px",
        },
        popoverLabel: {
          marginTop: theme.spacing(4),
        },
        popoverSlider: {
          width: "100%",
          marginTop: theme.spacing(2),
        },
        popoverSliderMarks: {
          width: `calc(100% - ${theme.spacing(6)}px)`,
          marginLeft: theme.spacing(3),
          marginRight: theme.spacing(3),
        },
        popoverSliderTextField: {
          width: "112px",
        },
      };
    },
    { name: "DisplayPruningSettings" }
  );
}
