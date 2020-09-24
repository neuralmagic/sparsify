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
        borderRadius: 0,
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
      info: {
        padding: theme.spacing(0, 0, 0, 2),
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        cursor: "pointer",
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
      body: {
        flex: "1 0",
        width: "100%",
        position: "relative",
      },
    }),
    { name: "AppSideNav" }
  );
}
