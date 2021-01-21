import { makeStyles } from "@material-ui/core/styles";

export default function makeGenericPageStyles() {
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "10%",
          paddingLeft: "10%",
          paddingRight: "10%",
        },
        icon: {
          fill: theme.palette.text.secondary,
          marginBottom: theme.spacing(6),
          width: "200px",
          height: "200px",
        },
        name: {
          display: "-webkit-box",
          lineClamp: 2,
          boxOrient: "vertical",
          overflow: "hidden",
        },
        desc: {
          marginTop: theme.spacing(2),
          display: "-webkit-box",
          lineClamp: 3,
          boxOrient: "vertical",
          overflow: "hidden",
        },
      };
    },
    { name: "GenericPage" }
  );
}
