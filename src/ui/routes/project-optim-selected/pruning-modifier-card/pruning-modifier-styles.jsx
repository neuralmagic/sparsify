import { makeStyles } from "@material-ui/core/styles";

export default function makePruningModifierCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        update: {
          width: theme.spacing(11),
          marginTop: theme.spacing(2),
        },
      };
    },
    { name: "PruningModifierCard" }
  );
}
