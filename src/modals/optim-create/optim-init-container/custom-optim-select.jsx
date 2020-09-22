import React from "react";

import {
    Box,
} from "@material-ui/core";
import useOptimSettingsState from "../hooks/optim-settings-hooks";
import OptimSwitch from "./optim-switch";

function CustomOptimSelect() {
    const { pruning, setPruning } = useOptimSettingsState();
    return (
        <Box paddingTop={2} paddingBottom={4}>
            <OptimSwitch
                value={pruning}
                onChange={setPruning}
                title="Pruning"
                description="Remove unused weights in the neural network to enable 
                reduction in compute for inference speedup."
            />
            <OptimSwitch
                title="Coming Soon - Quantization"
                description="Use lower precision numerical formats for weights in neural networks to 
                reduce bandwith and compute for inference speedup."
                disabled={true}
            />
            <OptimSwitch
                title="Coming Soon - Sparse transfer learning (trainable layers)"
                description="Use lower precision numerical formats for weights in neural 
                networks to reduce bandwith and compute for inference speedup."
                disabled={true}
            />
        </Box>
    )
}

export default CustomOptimSelect;