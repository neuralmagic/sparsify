import React, { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Box, Button, Tooltip, useTheme } from "@material-ui/core";

import makeStyles from "./export-styles";

function CodeContainer({ language, text, defaultFileName }) {
  const isDarkMode = useTheme().palette.type === "dark";
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const useStyles = makeStyles();
  const classes = useStyles();

  useEffect(() => {
    if (showCopiedTooltip) {
      setTimeout(() => setShowCopiedTooltip(false), 1000)
    }
  }, [showCopiedTooltip])

  return (
    <div>
      <SyntaxHighlighter
        language={language}
        style={isDarkMode ? atomOneDark : atomOneLight}
        className={classes.codeblock}
        showLineNumbers
        wrapLines
      >
        {text}
      </SyntaxHighlighter>
      <Box display="flex" justifyContent="flex-end">
        <Box>
          <Button
            component="a"
            download={defaultFileName}
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
            className={classes.textButton}
          >
            Save to disk
          </Button>
        </Box>
        <Box>
          <Tooltip open={showCopiedTooltip} onClose={() => setShowCopiedTooltip(false)} title="Copied to clipboard">
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
          
        </Box>
      </Box>
    </div>
  );
}

export default CodeContainer;
