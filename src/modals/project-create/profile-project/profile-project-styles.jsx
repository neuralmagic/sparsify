import { makeStyles } from "@material-ui/core/styles";

export default function makeSelectModelStyles() {
  return makeStyles(
    (theme) => {
      console.log(theme);
      return {
        root: {
          position: "relative",
          width: "100%",
          height: "100%",
        },
        content: {
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
        },
        profilesLayout: {
          display: "flex",
          flex: "1 0",
          marginTop: theme.spacing(1),
          marginBottom: theme.spacing(1),
        },
        profilesSpacer: {
          width: theme.spacing(4),
        },

        profileSettingsRoot: {
          height: `calc(100% - ${theme.spacing(2)})`,
          flex: "1 0",
          display: "flex",
          flexDirection: "column",
        },
        profileSettingsTitle: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        profileSettingsLabel: {
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginRight: "1px",
        },
        profileSettingsDivider: {
          marginTop: theme.spacing(0.5),
          marginBottom: theme.spacing(1),
        },
        profileSettingsContainer: {
          flex: "1 0",
          borderRadius: "4px",
          padding: theme.spacing(2),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        profileSettingsText: {},

        profileLabel: {
          marginLeft: 0,
        },
        profileBody: {
          width: "100%",
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          marginTop: theme.spacing(1),
        },

        textRow: {
          display: "flex",
          width: "100%",
          marginBottom: theme.spacing(2),
        },
        textField: {
          flex: "1 0",
        },
        textSpacer: {
          width: theme.spacing(2),
        },

        loaderContainer: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
        loaderText: {
          marginTop: theme.spacing(3),
        },
      };
    },
    { name: "SelectModel" }
  );
}
