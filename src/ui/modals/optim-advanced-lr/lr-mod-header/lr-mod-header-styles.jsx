import { makeStyles } from "@material-ui/core/styles";
import { adjustColorOpacity } from "../../../components";

export default function makeLRModHeaderStyles() {
  return makeStyles(
    (theme) => {
      return {
        modifiersHeader: {
          minHeight: "48px",
          padding: theme.spacing(1),
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          backgroundColor: adjustColorOpacity(theme.palette.primary.light, 0.1),
          display: "flex",
          alignItems: "center",
          borderRadius: "4px",
          overflow: "hidden",
        },
        spacer: {
          flex: "1 0",
        },
        lrRowItem: {
          width: "192px",
          display: "flex",
          alignItems: "flex-end",
        },
      };
    },
    { name: "LRModHeader" }
  );
}
