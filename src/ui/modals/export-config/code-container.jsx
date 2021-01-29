/*
Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
            <CopyToClipboard text={text} onCopy={() => setShowCopiedTooltip(true)}>
              <Button className={classes.textButton}>
                <div className={classes.textButton}>Copy to clipboard</div>
              </Button>
            </CopyToClipboard>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default CodeContainer;
