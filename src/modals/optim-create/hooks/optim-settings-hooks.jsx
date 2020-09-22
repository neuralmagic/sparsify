import { useState } from "react";

function useOptimSettingsState() {
    const [ pruning, setPruning ] = useState(true);
    const [ quantization, setQuantization ] = useState(false);
    const [ training, setTraining ] = useState(false);

    const [ optimizer, setOptimizer ] = useState("");
    const [ initLR, setInitLR ] = useState();
    const [ finalLR, setFinalLR ] = useState();

    const [ epochs, setEpochs ] = useState();

    return {
        pruning,
        setPruning,
        quantization,
        setQuantization,
        training,
        setTraining,
        optimizer,
        setOptimizer,
        initLR,
        setInitLR,
        finalLR,
        setFinalLR,
        epochs,
        setEpochs
    }
}

export default useOptimSettingsState;