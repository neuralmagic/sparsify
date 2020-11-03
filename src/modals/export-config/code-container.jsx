import React, { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Button, Tooltip, useTheme } from "@material-ui/core";

import makeStyles from "./export-styles";
import LoaderOverlay from "../../components/loader-overlay";

function CodeContainer({ language, text, defaultFileName, loading, error }) {
  const isDarkMode = useTheme().palette.type === "dark";
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const useStyles = makeStyles();
  const classes = useStyles();

  useEffect(() => {
    if (showCopiedTooltip) {
      setTimeout(() => setShowCopiedTooltip(false), 1000);
    }
  }, [showCopiedTooltip]);

  return (
    <div>
      <div className={classes.container}>
        <SyntaxHighlighter
          language={language}
          style={isDarkMode ? atomOneDark : atomOneLight}
          className={classes.codeblock}
          showLineNumbers
          wrapLines
        >
          {text}
        </SyntaxHighlighter>
        <LoaderOverlay loading={loading} error={error} loaderSize={96} />
      </div>

      <div className={classes.buttonContainer}>
        <div>
          <Button
            component="a"
            download={defaultFileName}
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
            className={classes.textButton}
          >
            Save to disk
          </Button>
        </div>
        <div>
          <Tooltip
            open={showCopiedTooltip}
            onClose={() => setShowCopiedTooltip(false)}
            title="Copied to clipboard"
          >
            <Button
              className={classes.textButton}
              onClick={() => {
                setShowCopiedTooltip(true);
                navigator.clipboard.writeText(text);
              }}
            >
              Copy to clipboard
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default CodeContainer;
