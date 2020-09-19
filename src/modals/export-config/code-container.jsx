import React from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { Box, Button, useTheme }  from '@material-ui/core';

import makeStyles from "./export-styles";


function CodeContainer({
    language,
    text,
    defaultFileName,
}) {
    const isDarkMode = useTheme().palette.type === "dark";
    const useStyles = makeStyles();
    const classes = useStyles();
    return (
        <div >
            <SyntaxHighlighter 
                language={language}
                style={isDarkMode ? atomOneDark : atomOneLight} 
                className={classes.codeblock} 
                showLineNumbers 
                wrapLines
            >
                {text}
            </SyntaxHighlighter>
            <Box display="flex" justifyContent="flex-end" >
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
                    <Button
                        className={classes.textButton}
                        onClick={() => {
                            navigator.clipboard.writeText(text)
                        }}
                    >
                        Copy to clipboard
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default CodeContainer;