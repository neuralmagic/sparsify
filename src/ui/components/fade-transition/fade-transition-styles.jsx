import { makeStyles } from "@material-ui/core/styles";

export default function makeFadeTransitionStyles() {
  return makeStyles(
    (theme) => {
      return {
        transitionEnter: {
          opacity: 0,
        },
        transitionEnterActive: {
          opacity: 1,
          transition: ({ transTime }) => `opacity ${transTime}ms`,
        },
        transitionExit: {
          opacity: 1,
        },
        transitionExitActive: {
          opacity: 0,
          transition: ({ transTime }) => `opacity ${transTime}ms`,
        },
        child: {
          height: "100%",
        },
      };
    },
    { name: "FadeTransition" }
  );
}
