import { makeStyles } from "@material-ui/core/styles";
import { referenceDarkTheme } from "../../../app/app-theme";

export default function makeBenchmarkCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          height: "350px",
          overflow: "visible",
          position: "relative",
        },
        layout: {
          height: "fit-content",
          width: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          maxWidth: "1024px",
          display: "flex",
          flexDirection: "column",
          margin: theme.spacing(3),
        },
        loaderContent: {
          alignItems: "center",
          flexDirection: "column",
          display: "flex",
          color: referenceDarkTheme.palette.text.primary,
        },
        cancelButton: {
          color: referenceDarkTheme.palette.text.secondary,
        },
        title: {
          marginBottom: theme.spacing(2),
          display: "flex",
          alignItems: "baseline",
        },
        headerName: {
          marginRight: theme.spacing(1),
          width: "fit-content",
        },
        headerNameGroup: {
          width: "fit-content",
        },
        optimLink: {
          textDecoration: "none",
          color: theme.palette.text.primary,
          "&:hover": {
            textDecoration: "underline",
          },
        },
        headerDate: {
          flexGrow: 1,
        },
        headerLabel: {
          marginRight: theme.spacing(1),
        },
        headerGroup: {
          marginRight: theme.spacing(2),
          display: "flex",
          alignItems: "center",
        },
        loaderContainer: {
          width: "100%",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        cardContainer: {
          height: "350px",
        },
        loaderText: {
          marginTop: theme.spacing(3),
        },
        transitionGroup: {
          height: "350px",
        },
      };
    },
    { name: "BenchmarkCard" }
  );
}
