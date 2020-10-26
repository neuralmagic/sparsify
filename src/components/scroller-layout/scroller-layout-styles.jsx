import { makeStyles } from "@material-ui/core/styles";

export default function makeScrollerLayoutStyles() {
  return makeStyles(
    (theme) => {
      return {
        layout: {
          overflow: "auto!important",
        },
      };
    },
    { name: "ScrollerLayout" }
  );
}
