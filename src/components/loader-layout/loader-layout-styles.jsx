import { makeStyles } from "@material-ui/core/styles";

export default function makeLoaderLayoutStyles() {
  return makeStyles(
    (theme) => ({
      root: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      error: {
        color: theme.palette.error.main,
      },
      container: {},
    }),
    { name: "LoaderLayout" }
  );
}
