import { makeStyles } from "@material-ui/core/styles";

export default function makeLoaderLayoutStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
        },
        error: {
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.palette.error.main,
        },
        loader: {
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        progressContainer: {
          position: "relative"
        },
        progressTextContainer: {
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      };
    },
    { name: "LoaderLayout" }
  );
}
