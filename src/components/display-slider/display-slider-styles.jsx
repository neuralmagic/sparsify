import { makeStyles } from "@material-ui/core/styles";

export default function makeDisplaySliderStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          display: "flex",
          alignItems: "center",
        },
        slider: {
          width: 0,
          flex: "1 0",
          marginLeft: theme.spacing(3),
        },
        sliderMarkLabel: {
          top: -1 * theme.spacing(1),
          fontSize: 10
        },
        sliderMarkLabelActive: {
          color: 'rgba(0, 0, 0, 0.54)'
        },
      }
    },
    { name: "DisplaySlider" }
  );
}