import { makeStyles } from "@material-ui/core/styles";

export default function makeOptimPruningStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          overflow: "visible"
        },
        body: {
          position: "relative",
          height: "fit-content",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        },
        layout: {
          height: "fit-content",
          width: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          maxWidth: "1024px",
          display: "flex",
          flexDirection: "column",
          margin: theme.spacing(3),
        },
        loader: {
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: theme.spacing(8),
        },
        title: {
          marginBottom: theme.spacing(2),
          display: "flex",
        },
      };
    },
    { name: "OptimPruning" }
  );
}
