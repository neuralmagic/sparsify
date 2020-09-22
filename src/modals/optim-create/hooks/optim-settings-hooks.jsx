import { useState } from "react";

function useOptimSettingsState() {
  const [pruning, setPruning] = useState(true);
  const [quantization, setQuantization] = useState(false);
  const [training, setTraining] = useState(false);

  return {
    pruning,
    setPruning,
    quantization,
    setQuantization,
    training,
    setTraining,
  };
}

export default useOptimSettingsState;
