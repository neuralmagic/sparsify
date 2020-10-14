import { makeStyles } from "@material-ui/core/styles";

export default function createProjectOptimStyles() {
  return makeStyles(
    (theme) => {
      const paddingButton = theme.spacing(3);
      const positionButton = theme.spacing(4);

      return {
        fab: {
          position: "fixed",
          right: `${positionButton}px`,
          bottom: `${positionButton}px`,
          padding: `${paddingButton}px`,
        },
        fabIcon: {
          marginRight: theme.spacing(1),
        },
      };
    },
    { name: "ProjectOptim" }
  );
}
