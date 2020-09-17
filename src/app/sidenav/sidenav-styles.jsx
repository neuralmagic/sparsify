import { makeStyles } from "@material-ui/core/styles";

export default function makeAppSideNavStyles() {
  return makeStyles(
    (theme) => ({
      root: {
        height: "100%",
        width: "288px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        fontSize: theme.typography.fontSize,
        fontFamily: theme.typography.fontFamily,
      },
      header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: theme.spacing(3),
      },
      logo: {
        width: "40px",
        height: "40px",
        "& .colorOne": {
          color: theme.palette.text.primary,
          fill: theme.palette.text.primary,
        },
      },
      title: {
        paddingLeft: theme.spacing(2),
        fontSize: "32px",
        color: theme.palette.text.primary,
      },
      trademark: {
        fontSize: "10px",
        color: theme.palette.text.secondary,
        alignSelf: "start",
        paddingTop: theme.spacing(0.5),
        paddingLeft: theme.spacing(0.5),
      },
      divider: {
        height: "1px",
        width: "100%",
        background: theme.palette.divider,
      },
      body: {
        flex: "1 0",
        width: "100%",
        "& div": {
          height: "100%",
        },
      },
    }),
    { name: "AppSideNav" }
  );
}
