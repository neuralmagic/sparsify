import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplayCardBodyStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          flex: "1 0",
          display: "flex",
          height: "100%",
        },
      };
    },
    { name: "DisplayCardBody" }
  );
}
