import { makeStyles } from "@material-ui/core/styles";

export default function makeDescribeProjectStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {},
        content: {
          display: "flex",
          flexDirection: "column",
        },
        textField: {
          width: "99%",
          marginTop: theme.spacing(3),
        },
      };
    },
    { name: "DescribeProject" }
  );
}
