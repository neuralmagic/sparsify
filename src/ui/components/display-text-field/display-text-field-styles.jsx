import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayTextFieldStyles() {
  return makeStyles(
    (theme) => {
      return {
        textField: {
          width: theme.spacing(8),

          "& input": {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
          },
        },
      };
    },
    { name: "DisplayTextField" }
  );
}
