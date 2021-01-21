import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectSettingsCardInfoRowStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          flexDirection: "row",
        },
        label: {
          minWidth: "112px",
        },
        value: {
          flex: "1 0",
          marginLeft: theme.spacing(2),
        },
        valueTooltip: {
          fontSize: theme.typography.body1.fontSize,
        },
      };
    },
    { name: "ProjectSettingsCardInfoRow" }
  );
}
