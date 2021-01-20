import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectSideNavMenuOptimStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {},
        loaderLayout: {
          display: "flex",
          flexDirection: "column",
        },
        divider: {
          marginBottom: theme.spacing(1),
        },
        spacer: {
          width: "100%",
          height: theme.spacing(4),
        },
      };
    },
    { name: "ProjectSideNavMenuOptim" }
  );
}
