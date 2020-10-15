import { makeStyles } from "@material-ui/core/styles";

export default function makeDefaultHomeStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        layout: {
          width: "80%",
          maxWidth: "960px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "10%",
          paddingLeft: "10%",
          paddingRight: "10%",
        },
        logoHeader: {
          marginBottom: theme.spacing(6),
        },
        icon: {
          width: "200px",
          height: "200px",
        },
        title: {
          textTransform: "uppercase",
          fontWeight: "bold",
        },
        desc: {
          marginTop: theme.spacing(2),
        },
      };
    },
    { name: "DefaultHome" }
  );
}
