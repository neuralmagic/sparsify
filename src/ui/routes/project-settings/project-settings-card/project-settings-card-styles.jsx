import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectSettingsCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          display: "flex",
          flexDirection: "column",
          padding: theme.spacing(4),
          paddingTop: theme.spacing(5),
        },
        name: {
          width: "50%",
        },
        cardInputRow: {
          marginBottom: theme.spacing(3),
        },
        cardInfoRow: {
          marginBottom: theme.spacing(1),
        },
      };
    },
    { name: "ProjectSettingsCard" }
  );
}
