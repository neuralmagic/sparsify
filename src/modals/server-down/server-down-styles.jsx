import { makeStyles } from "@material-ui/core/styles";

export default function createServerDownStyles() {
  return makeStyles((theme) => {
    return {
      dialog: {
        padding: theme.spacing(2),
      },
      root: {
        zIndex: 2000,
      },
      containedButton: {
        textTransform: "none",
      },
    };
  });
}
