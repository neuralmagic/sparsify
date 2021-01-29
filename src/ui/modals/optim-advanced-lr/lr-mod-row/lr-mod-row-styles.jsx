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

import { makeStyles } from "@material-ui/core/styles";

export default function makeLRModRowStyles() {
  return makeStyles(
    (theme) => {
      return {
        lrRowItem: {
          width: "192px",
          display: "flex",
          alignItems: "flex-end",
        },

        lrModRow: {
          display: "flex",
          alignItems: "flex-end",
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),

          "& input": {
            paddingTop: theme.spacing(0.75),
            paddingBottom: theme.spacing(0.75),
          },
        },
        lrModType: {
          marginLeft: theme.spacing(3),
        },
        lrModTypeSelector: {
          width: `calc(100% - ${theme.spacing(6)}px)`,
        },
        lrModEpoch: {
          width: "56px",
          marginRight: theme.spacing(3),
        },
        lrModOptions: {
          flex: "1 0",
        },
        lrModOption: {
          width: "80px",
          marginRight: theme.spacing(3),
        },
        lrModButtons: {
          marginRight: theme.spacing(3),
          alignSelf: "center",
        },
      };
    },
    { name: "LRModRow" }
  );
}
