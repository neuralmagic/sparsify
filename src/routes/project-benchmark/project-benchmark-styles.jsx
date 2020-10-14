import { makeStyles } from "@material-ui/core/styles";

export default function makeBenchmarkStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
        },
        fab: {
          position: "fixed",
          right: theme.spacing(4),
          bottom: theme.spacing(4),
          padding: theme.spacing(3),
        },
        body: {
          position: "relative",
          height: "fit-content",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
      };
    },
    { name: "Benchmark" }
  );
}
