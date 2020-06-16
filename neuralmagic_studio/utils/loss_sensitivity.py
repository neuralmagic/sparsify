import json
import logging
from functools import reduce
from typing import Any, Callable, Dict, List, Union

import numpy as np
from neuralmagic_studio.utils.model_runner import (
    LossRunner,
    ModelRunner,
    ORTModelRunner,
)
from scipy.special import kl_div
from tqdm import auto

try:
    from neuralmagicML.recal import (
        KSLossSensitivityResult,
        KSLossSensitivityAnalysis,
        KSLossSensitivityProgress,
    )
except (OSError, ModuleNotFoundError):
    logging.warning(
        "Installation of neuralmagicML not found. Some features will be disabled."
    )
    KSLossSensitivityResult = None
    KSLossSensitivityAnalysis = None
    KSLossSensitivityProgress = None


DEFAULT_LOSS_SPARSITY_LEVELS = [
    0,
    0.05,
    0.2,
    0.4,
    0.6,
    0.7,
    0.8,
    0.9,
    0.95,
    0.975,
    0.99,
]

__all__ = [
    "OneShotKSLossSensitivity",
    "KSLossSensitivityProgressWrapper",
    "LossAnalysisParser",
]


def _get_minimums(outputs: List):
    flattened_baseline_outputs = [
        np.array([sub_output.flatten() for sub_output in output]).flatten()
        for output in outputs
    ]

    return reduce(
        lambda minimum, current: np.minimum(minimum, current),
        flattened_baseline_outputs,
    )


def _make_kl_with_min(baseline_mins: List):
    def kl_divergence(prediction, expected):
        prediction_flat = reduce(
            lambda accum, current: np.append(accum, [arr.flatten() for arr in current]),
            prediction,
            np.array([]),
        )
        expected_flat = reduce(
            lambda accum, current: np.append(accum, [arr.flatten() for arr in current]),
            expected,
            np.array([]),
        )
        ones = np.ones_like(prediction_flat)
        expected_flat += ones - baseline_mins
        prediction_flat += ones - baseline_mins

        expected_flat = np.maximum(expected_flat, ones)
        prediction_flat = np.maximum(prediction_flat, ones)

        out = np.mean(kl_div(prediction_flat, expected_flat))
        return out

    return kl_divergence


class OneShotKSLossSensitivity:
    def __init__(
        self,
        prunable_nodes: List[str],
        model: Any,
        inputs: List,
        sparsity_levels: List[float] = None,
        loss_function: Callable = None,
    ):
        if KSLossSensitivityAnalysis is None:
            raise Exception("neuralmagicML must be installed to use this feature.")

        if sparsity_levels is None:
            self.sparsity_levels = DEFAULT_LOSS_SPARSITY_LEVELS

        self.inputs = inputs
        self.analysis = KSLossSensitivityAnalysis()
        self.analysis_parsed = {}
        self.progress = KSLossSensitivityProgressWrapper(
            layers=[node for node in prunable_nodes],
            sparsity_levels=self.sparsity_levels,
            samples_per_measurement=len(inputs),
        )
        model_runner = ORTModelRunner(model)

        self.baseline_outputs = [
            output["output"] for output in model_runner.run(inputs)
        ]

        self.baseline_mins = _get_minimums(self.baseline_outputs)

        if loss_function is None:
            loss_function = _make_kl_with_min(self.baseline_mins)
        self.loss_function = loss_function

    def run(
        self, inputs: List, prunable_nodes: List, model_generator: Callable,
    ):
        logging.debug("Running one shot KS loss sensitivity")
        for layer_index, current_node in enumerate(prunable_nodes):
            self.progress.update(
                layer_index=layer_index,
                layer_name=current_node.node_name,
                sparsity_index=0,
            )
            sparsity_losses = []

            for sparsity_index, sparsity_level in enumerate(self.sparsity_levels):
                self.progress.update(sparsity_index=sparsity_index)
                new_model = model_generator(current_node, sparsity_level)
                self.loss_runner = LossRunner(
                    new_model, self.loss_function, ORTModelRunner
                )
                loss = np.mean(
                    [
                        output["loss"]
                        for output in self.loss_runner.run(
                            inputs, self.baseline_outputs
                        )
                    ]
                )
                sparsity_losses.append((sparsity_level, float(loss)))

            self.analysis.results.append(
                KSLossSensitivityResult(
                    current_node.node_name,
                    "weight",
                    current_node.op_type,
                    sparsity_losses,
                )
            )
        self.analysis_parsed = LossAnalysisParser(self.analysis.dict()).get_loss_info()
        logging.debug("Finished running one shot KS loss sensitivity")
        return self.analysis_parsed

    def save(self, loss_file: str):
        with open(loss_file, "w+") as js:
            js.write(json.dumps(self.analysis_parsed))


class KSLossSensitivityProgressWrapper:
    def __init__(
        self,
        layers: List[str],
        sparsity_levels: List[Any],
        samples_per_measurement: int,
        layer_name: str = "",
        layer_index: int = 0,
        sparsity_index: int = 0,
        measurement_step: int = 0,
    ):
        self._progress = KSLossSensitivityProgress(
            layer_index=layer_index,
            layer_name=layer_name,
            layers=layers,
            sparsity_index=sparsity_index,
            sparsity_levels=sparsity_levels,
            measurement_step=measurement_step,
            samples_per_measurement=samples_per_measurement,
        )
        self._progress_hook = KSLossSensitivityProgressWrapper.standard_update_hook()

    @staticmethod
    def standard_update_hook():
        """
        :return: a hook that will display a tqdm bar for tracking progress
            of the analysis
        """
        bar = None
        last_layer = None
        last_level = None

        def _update(progress: KSLossSensitivityProgress):
            nonlocal bar
            nonlocal last_layer
            nonlocal last_level

            if bar is None and last_layer is None and last_level is None:
                num_steps = len(progress.layers) * len(progress.sparsity_levels)
                print("num_steps: {}".format(num_steps))
                bar = auto.tqdm(total=num_steps, desc="KS Loss Sensitivity Analysis")
            elif bar is None:
                return

            if (
                (
                    last_layer is None
                    or last_layer != progress.layer_index
                    or last_level is None
                    or last_level != progress.sparsity_index
                )
                and progress.layer_index >= 0
                and progress.sparsity_index >= 0
            ):
                bar.update(1)
                last_layer = progress.layer_index
                last_level = progress.sparsity_index

            if progress.layer_index == len(
                progress.layers
            ) and progress.sparsity_index == len(progress.sparsity_levels):
                bar.close()
                bar = None

        return _update

    def update(
        self,
        layer_index: int = None,
        layer_name: str = None,
        sparsity_index: int = None,
        measurement_step: int = None,
    ):
        if layer_index:
            self._progress.layer_index = layer_index
        if layer_name:
            self._progress.layer_name = layer_name
        if sparsity_index:
            self._progress.sparsity_index = sparsity_index
        if measurement_step:
            self._progress.measurement_step = measurement_step
        self._progress_hook(self._progress)


class LossAnalysisParser:
    def __init__(self, loss_content: Dict):
        self._analysis = []

        for layer in loss_content["results"]:
            self._analysis.append(LossNode(layer))

    def get_loss_info(self) -> List[Dict[str, Any]]:
        logging.debug("Parsing sparse loss analysis")
        loss_info = [analysis.loss_info for analysis in self._analysis]
        logging.debug("Finished parsing sparse loss analysis")
        return loss_info


class LossNode:
    def __init__(self, data: Dict[str, Any]):
        self._name = data["name"]
        self._param = data["param_name"]
        self._type = data["type_"]
        self._sparsities = data["measured"]

    @property
    def loss_info(self) -> Dict[str, Any]:
        baseline_loss = [
            sparsity for sparsity in self._sparsities if sparsity["sparsity"] == 0
        ]
        baseline_loss = baseline_loss[0] if len(baseline_loss) > 0 else None
        return {
            "id": self._name,
            "baseline": baseline_loss,
            "sparse": [
                sparsity for sparsity in self._sparsities if sparsity["sparsity"] != 0
            ],
        }
