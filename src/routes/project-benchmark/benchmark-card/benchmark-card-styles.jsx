import { makeStyles } from "@material-ui/core/styles";

export default function makeBenchmarkCardStyles() {
  return makeStyles(
    (theme) => {
      return {
        card: {
          height: "350px",
          overflow: "visible",
        },
        layout: {
          height: "fit-content",
          width: `calc(100% - 2 * ${theme.spacing(3)}px)`,
          maxWidth: "1024px",
          display: "flex",
          flexDirection: "column",
          margin: theme.spacing(3),
        },
        title: {
          marginBottom: theme.spacing(2),
          display: "flex",
          alignItems: "flex-end",
        },
        headerName: {
          marginRight: theme.spacing(2),
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
