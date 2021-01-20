import { makeStyles } from "@material-ui/core/styles";

export default function makeProjectSideNavMenuProfilePerfStyles() {
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
      };
    },
    { name: "ProjectSideNavMenuProfilePerf" }
  );
}
