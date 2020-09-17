import { makeStyles } from "@material-ui/core/styles";

export default function makeAppStyles() {
  return makeStyles(
    (theme) => ({
      root: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.palette.background.default,
      },
      main: {
        display: "flex",
        flex: "1 0",
        position: "relative",
      },
    }),
    { name: "App" }
  );
}
