import { makeStyles } from "@material-ui/core/styles";

export default function makeAppMainStyles() {
  return makeStyles(
    (theme) => ({
      root: {
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: theme.palette.background.default,
      },
    }),
    { name: "AppMain" }
  );
}
