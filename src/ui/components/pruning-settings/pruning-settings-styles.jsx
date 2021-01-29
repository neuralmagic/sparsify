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

export default function makeOptimAdvancedPruningStyles() {
  return makeStyles(
    (theme) => {
      return {
        root: {
          "& .MuiTextField-root": {
            width: 60,
          },
        },
        title: {
          fontSize: 14,
          marginBottom: theme.spacing(2),
        },
        balanceTitle: {
          fontSize: 14,
        },
        slider: {
          width: 200,
          marginLeft: 30,
        },
        sliderMarkLabel: {
          top: -10,
          fontSize: 10,
        },
        sliderMarkLabelActive: {
          color: "rgba(0, 0, 0, 0.54)",
        },
        recoveryContainer: {
          marginTop: 30,
        },
      };
    },
    { name: "PruningSettings" }
  );
}
