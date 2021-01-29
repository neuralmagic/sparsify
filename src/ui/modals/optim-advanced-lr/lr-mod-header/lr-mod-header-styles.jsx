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
