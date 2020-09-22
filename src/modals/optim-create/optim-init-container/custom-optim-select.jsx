import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import OptimSwitch from "./optim-switch";

function CustomOptimSelect({ pruning, setPruning }) {
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
  );
}

CustomOptimSelect.propTypes = {
  pruning: PropTypes.bool.isRequired,
  setPruning: PropTypes.func.isRequired,
};

export default CustomOptimSelect;
