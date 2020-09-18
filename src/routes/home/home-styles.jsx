import { makeStyles } from "@material-ui/core/styles";

export default function createHomeStyles() {
  return makeStyles(
    (theme) => {
      const paddingButton = theme.spacing(4);

      return {
        fab: {
          position: "absolute",
          bottom: `${paddingButton}px`,
          right: `${paddingButton}px`,
        },
      };
    },
    { name: "Home" }
  );
}
