# Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Helper functions and classes for flask blueprints specific to project optimizations
for pruning
"""


import logging
from collections import OrderedDict, defaultdict
from typing import Any, Dict, List, NamedTuple, Tuple, Union

import numpy

from sparseml.utils import interpolate_list_linear


__all__ = [
    "PruningSettings",
    "PruningModelEvaluator",
]


_LOGGER = logging.getLogger(__name__)


PruningSettings = NamedTuple(
    "PruningSettings",
    [
        ("mask_type", str),
        ("sparsity", Union[float, None]),
        ("balance_perf_loss", float),
        ("filter_min_sparsity", Union[float, None]),
        ("filter_min_perf_gain", Union[float, None]),
        ("filter_min_recovery", Union[float, None]),
    ],
)


class _PruningPointRescaler(object):
    """
    Convenience class for normalizing / rescaling values
    """

    def __init__(self):
        self.min_val = None  # type: Union[None, float]
        self.max_val = None  # type: Union[None, float]

    def __repr__(self):
        return f"_ValueRescaler(min_val={self.min_val}, max_val={self.max_val})"

    def __call__(self, val: Union[None, float]) -> Union[None, float]:
        if val is None:
            return val

        # normalize the value such that it will fall in the range [0, max]
        # by subtracting the min
        rescaled = val - self.min_val if self.min_val else val

        # normalize the value such that it will fall in the range [0, 1.0]
        # by dividing by the max range
        max_range = (
            self.max_val - self.min_val
            if self.max_val is not None and self.min_val is not None
            else 0.0
        )
        rescaled = rescaled / max_range if max_range else rescaled

        return rescaled

    def add_rescale_series(self, min_series_val: float, max_series_val: float):
        if self.min_val is None or min_series_val < self.min_val:
            self.min_val = min_series_val

        if self.max_val is None or max_series_val > self.max_val:
            self.max_val = max_series_val


class _PruningNodeSeriesValue:
    """
    Simple data object to map the number of sparse params and the defined sparsity
    at that level to a series value
    """

    def __init__(
        self,
        sparse_params: int,
        sparsity: float,
        value: float,
        node_id: Union[str, None] = None,
    ):
        self.sparse_params = sparse_params
        self.sparsity = sparsity
        self.value = value
        self.node_id = node_id

    def __repr__(self):
        return (
            f"_PruningNodeSeriesValue(sparse_params={self.sparse_params}, "
            f"sparsity={self.sparsity}, value={self.value}, node_id={self.node_id})"
        )


class _PruningNodeSeries(object):
    """
    Object to contain a series of data that allows estimations of values
    and cleansing of the data for optimization tasks.
    """

    def __init__(
        self,
        sparsity_measurements: Union[None, Dict[str, float]],
        baseline_key: str,
        num_params: int,
        increasing: bool,
    ):
        self.sparsity_measurements = sparsity_measurements
        self.baseline_key = baseline_key
        self.num_params = num_params
        self.increasing = increasing

        self.value_baseline = None  # type: Union[None, float]
        self.value_min = None  # type: Union[None, float]
        self.value_max = None  # type: Union[None, float]
        self.value_smoothed_min = None  # type: Union[None, float]
        self.value_smoothed_max = None  # type: Union[None, float]
        self.value_optimized_min = None  # type: Union[None, float]
        self.value_optimized_max = None  # type: Union[None, float]

        self.data = []  # type: List[_PruningNodeSeriesValue]
        self.data_smoothed = []  # type: List[_PruningNodeSeriesValue]
        self.data_optimization = []  # type: List[_PruningNodeSeriesValue]
        self._set_data()

    def estimated_value(self, sparsity: Union[None, float]) -> Union[None, float]:
        if not self.data:
            return None

        if not sparsity:
            return self.value_baseline

        measurements = [(val.sparsity, val.value) for val in self.data]
        _, interpolated = interpolate_list_linear(measurements, sparsity)[0]

        return interpolated

    def estimated_gain(self, sparsity: Union[None, float]) -> Union[None, float]:
        """
        :param sparsity: the sparsity to get the gain value for
        :return: the ratio of the predicted value at the given sparsity
            as compared with the baseline value
        """

        if not self.data:
            return None

        if not sparsity:
            return 1.0

        value = self.estimated_value(sparsity)

        if not value or not self.value_baseline:
            return 0.0

        return self.value_baseline / value

    def estimated_sensitivity(self, sparsity: Union[None, float]) -> Union[None, float]:
        """
        :param sparsity: the sparsity to get the sensitivity value for
        :return: the sensitivity comparison (difference) of the measurement
            at the given sparsity compared with the baseline
        """

        if not self.data:
            return None

        if not sparsity:
            return None

        value = self.estimated_value(sparsity)

        if value is None or self.value_baseline is None:
            return None

        # subtract from baseline if decreasing so lower values = more sensitive: perf
        # subtract from sparse val if increasing so higher values = more sensitive: loss

        return (
            (self.value_baseline - value)
            if not self.increasing
            else (value - self.value_baseline)
        )

    def costs(
        self, rescaler: _PruningPointRescaler, use_max: bool
    ) -> List[Tuple[float, Union[None, float]]]:
        """
        :param rescaler: the rescaler to use to rescale the optimized values
            to the [0.0, 1.0] range
        :param use_max: True to use the max value for all measurements,
            False to interpolate between. Max value is used for FLOPS performance
            because the slopes for smaller convs are less and therefore prioritized
            improperly by optimization
        :return: a list of tuples containing (sparsity, cost)
        """
        if not self.data_optimization:
            return [(float(index) / 100.0, None) for index in range(100)]

        def _get_val(v: float) -> float:
            return rescaler(v if not use_max else self.value_optimized_max)

        measurements = [
            (val.sparsity, _get_val(val.value)) for val in self.data_optimization
        ]

        # creates the data at increments of 1% levels from 0 to 99
        costs = interpolate_list_linear(
            measurements, [float(index) / 100.0 for index in range(100)]
        )

        return costs

    def _set_data(self):
        if not self.sparsity_measurements:
            return

        # smoothed values will always keep with the trend given
        # if set as increasing, value will always be equal to or greater than last value
        # if set as decreasing, value will always be equal to or less than last value
        smoothed_val = None

        for key, meas in self.sparsity_measurements.items():
            if key == self.baseline_key:
                self.value_baseline = meas

            sparsity = float(key)
            sparse_params = int(sparsity * self.num_params)
            self.data.append(_PruningNodeSeriesValue(sparse_params, sparsity, meas))

            if (
                smoothed_val is None
                or (self.increasing and meas >= smoothed_val)
                or (not self.increasing and meas <= smoothed_val)
            ):
                smoothed_val = meas

            self.data_smoothed.append(
                _PruningNodeSeriesValue(sparse_params, sparsity, smoothed_val)
            )

        self.data.sort(key=lambda x: x.sparse_params)
        self.data_smoothed.sort(key=lambda x: x.sparse_params)
        self.value_min = min([val.value for val in self.data])
        self.value_max = max([val.value for val in self.data])
        self.value_smoothed_min = min([val.value for val in self.data_smoothed])
        self.value_smoothed_max = max([val.value for val in self.data_smoothed])

        for val in self.data_smoothed:
            optimize_value = val.value

            if not self.increasing:
                # need to invert the graph so the values are always increasing
                # for the optimization algorithms.
                # do this by reformulating as the difference from the smoothed max
                # ex: -x^2 + 5 => 5 - (-x^2 + 5)
                optimize_value = self.value_smoothed_max - optimize_value

            self.data_optimization.append(
                _PruningNodeSeriesValue(val.sparse_params, val.sparsity, optimize_value)
            )

        self.data_optimization.sort(key=lambda x: x.sparse_params)
        self.value_optimized_min = min([val.value for val in self.data_optimization])
        self.value_optimized_max = max([val.value for val in self.data_optimization])


class _PruningNodeEvaluator(object):
    """
    Evaluator for a model's node for pruning.
    Able to estimate the effect of pruning on the node for performance, loss, etc

    :param node_id: id of the node to create the evaluator for
    :param model_analysis: analysis of the model
    :param perf_analysis: performance analysis of the model, if any
    :param loss_analysis: loss analysis of the model, if any
    """

    def __init__(
        self,
        node_id: str,
        model_analysis: Dict,
        perf_analysis: Union[None, Dict],
        loss_analysis: Union[None, Dict],
    ):
        self.node_id = node_id
        self.analysis = _PruningNodeEvaluator._extract_node_analysis(
            node_id, model_analysis
        )
        self.num_params = self.analysis["params"]
        self.num_prunable_params = self.analysis["prunable_params"]
        self.num_flops = self.analysis["flops"]

        self.analysis_perf = _PruningNodeEvaluator._extract_node_perf_analysis(
            node_id, perf_analysis
        )
        self.analysis_loss = _PruningNodeEvaluator._extract_node_loss_analysis(
            node_id, loss_analysis
        )

        self.series_params = _PruningNodeSeries(
            sparsity_measurements=OrderedDict(
                [
                    ("0.0", self.num_params),
                    ("1.0", self.num_params - self.num_prunable_params),
                ]
            ),
            baseline_key="0.0",
            num_params=self.num_params,
            increasing=False,
        )
        self.series_flops = _PruningNodeSeries(
            sparsity_measurements=(
                OrderedDict([("0.0", self.num_flops), ("1.0", 0.0)])
                if self.num_flops
                else None
            ),
            baseline_key="0.0",
            num_params=self.num_params,
            increasing=False,
        )
        self.series_perf = _PruningNodeSeries(
            sparsity_measurements=(
                self.analysis_perf["measurements"] if self.analysis_perf else None
            ),
            baseline_key=(
                self.analysis_perf["baseline_measurement_key"]
                if self.analysis_perf
                else None
            ),
            num_params=self.num_params,
            increasing=False,
        )
        self.series_loss = _PruningNodeSeries(
            sparsity_measurements=(
                self.analysis_loss["measurements"] if self.analysis_loss else None
            ),
            baseline_key=(
                self.analysis_loss["baseline_measurement_key"]
                if self.analysis_loss
                else None
            ),
            num_params=self.num_params,
            increasing=True,
        )
        self.series_loss_est = _PruningNodeSeries(
            sparsity_measurements=OrderedDict(
                [
                    ("0.0", 0.0),
                    ("1.0", self.analysis["prunable_equation_sensitivity"]),
                ]
            ),
            baseline_key="0.0",
            num_params=self.num_params,
            increasing=True,
        )

    @property
    def available_series_perf(self) -> _PruningNodeSeries:
        """
        :return: the available performance series,
            falls back on flops if perf sensitivity is not available
        """
        return self.series_perf if self.analysis_perf is not None else self.series_flops

    @property
    def available_series_loss(self) -> _PruningNodeSeries:
        """
        :return: the available loss series,
            falls back on estimated loss if loss sensitivity is not available
        """
        return (
            self.series_loss if self.analysis_loss is not None else self.series_loss_est
        )

    @property
    def structurally_pruned(self) -> bool:
        """
        :return: True if the node is structurally pruned (group convolutions),
            False otherwise
        """
        attributes = (
            self.analysis["attributes"] if "attributes" in self.analysis else None
        )

        return attributes and "group" in attributes and attributes["group"] > 1

    def eval_dict(
        self,
        sparsity: Union[float, None],
        baseline_sparsity: Union[float, None],
        overridden: bool,
    ) -> Dict[str, Any]:
        sensitivity_sparsities = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 0.95, 0.99]
        perf_sensitivities = [
            (sparsity, self.available_series_perf.estimated_sensitivity(sparsity))
            for sparsity in sensitivity_sparsities
        ]
        loss_sensitivities = [
            (sparsity, self.available_series_loss.estimated_sensitivity(sparsity))
            for sparsity in sensitivity_sparsities
        ]

        return {
            "node_id": self.node_id,
            "sparsity": sparsity,
            "overridden": overridden,
            "perf_sensitivities": perf_sensitivities,
            "loss_sensitivities": loss_sensitivities,
            "est_recovery": self.recovery(sparsity, baseline_sparsity),
            "est_loss_sensitivity": self.available_series_loss.estimated_sensitivity(
                PruningModelEvaluator.EVAL_SENSITIVITY_SPARSITY,
            ),
            "est_perf_sensitivity": self.available_series_perf.estimated_sensitivity(
                PruningModelEvaluator.EVAL_SENSITIVITY_SPARSITY,
            ),
            "est_time": self.series_perf.estimated_value(sparsity),
            "est_time_baseline": self.series_perf.value_baseline,
            "est_time_gain": self.series_perf.estimated_gain(sparsity),
            "params_baseline": self.series_params.value_baseline,
            "params": self.series_params.estimated_value(sparsity),
            "compression": self.series_params.estimated_gain(sparsity),
            "flops_baseline": self.series_flops.value_baseline,
            "flops": self.series_flops.estimated_value(sparsity),
            "flops_gain": self.series_flops.estimated_gain(sparsity),
        }

    def recovery(
        self,
        sparsity: Union[float, None],
        baseline_sparsity: Union[float, None],
    ) -> Union[float, None]:
        """
        :param sparsity: the sparsity to get recovery for
        :param baseline_sparsity: the baseline sparsity to use for recovery
        :return: the estimated confidence of recovery for the given sparsity
            as compared to the baseline
        """

        baseline = self.available_series_loss.estimated_sensitivity(baseline_sparsity)
        estimated = self.available_series_loss.estimated_sensitivity(sparsity)

        if baseline == estimated or not sparsity:
            # baseline equals estimated or layer is not pruned
            # set recovery to 1
            return 1.0

        if not baseline or not baseline_sparsity:
            # baseline says layer should not be pruned and it is
            # set recovery to 0
            return 0.0

        # use percent difference to determine recovery between the
        # loss optimal baseline sensitivity and the target sparsity sensitivity
        # add 1 to it such that perfect recovery is predicted at 1.0
        # less than 1.0 gives a worse chance of recovery
        # greater than 1.0 gives a better chance of recovery

        return (baseline - estimated) / baseline + 1.0

    def optimization_costs(
        self,
        balance_perf_loss: float,
        perf_rescaler: _PruningPointRescaler,
        loss_rescaler: _PruningPointRescaler,
    ) -> List[_PruningNodeSeriesValue]:
        """
        :param balance_perf_loss: the weight [0.0, 1.0] for balancing perf vs loss;
            0.0 for all performance, 1.0 for all loss
        :param perf_rescaler: rescaler to use to rescale vales for performance
            before calculating cost
        :param loss_rescaler: rescaler to use to rescale vales for loss
            before calculating cost
        :return: a list of tuples containing the sparsities from 0% to 99% and
            their associated cost for pruning the node to that sparsity
        """
        loss_costs = self.available_series_loss.costs(loss_rescaler, use_max=False)
        perf_costs = self.available_series_perf.costs(
            perf_rescaler,
            use_max=self.available_series_perf == self.series_flops,
        )
        costs = []

        for ((sparsity, loss_cost), (_, perf_cost)) in zip(loss_costs, perf_costs):
            loss_cost = loss_cost or 0
            perf_cost = perf_cost or 0
            cost = balance_perf_loss * loss_cost + (1.0 - balance_perf_loss) * perf_cost
            costs.append(
                _PruningNodeSeriesValue(
                    round(sparsity * self.num_params), sparsity, cost, self.node_id
                )
            )

        return costs

    @staticmethod
    def _extract_node_analysis(node_id: str, model_analysis: Dict) -> Dict:
        analysis = None

        for node in model_analysis["nodes"]:
            if node["id"] == node_id:
                analysis = node
                break
        assert analysis

        return analysis

    @staticmethod
    def _extract_node_perf_analysis(
        node_id: str, perf_analysis: Union[None, Dict]
    ) -> Union[None, bool, Dict]:
        if not perf_analysis:
            return None

        analysis = False
        for op in perf_analysis["pruning"]["ops"]:
            if op["id"] == node_id:
                analysis = op

        return analysis

    @staticmethod
    def _extract_node_loss_analysis(
        node_id: str, loss_analysis: Union[None, Dict]
    ) -> Union[None, bool, Dict]:
        if not loss_analysis:
            return None

        analysis = False
        for op in loss_analysis["pruning"]["ops"]:
            if op["id"] == node_id:
                analysis = op

        return analysis


class _PruningNodeSetting(object):
    def __init__(self):
        self.baseline_sparsity = None
        self.sparsity = None
        self.overridden = False


class PruningModelEvaluator(object):
    """
    Evaluator for a model for pruning.
    Able to estimate the effect of pruning on a model and each prunable node in a model
    for performance, loss, etc

    :param model_analysis: analysis of the model
    :param perf_analysis: performance analysis of the model, if any
    :param loss_analysis: loss analysis of the model, if any
    """

    MAX_NODE_SPARSITY = 0.95
    EVAL_SENSITIVITY_SPARSITY = 0.95

    def __init__(
        self,
        model_analysis: Dict,
        perf_analysis: Union[None, Dict],
        loss_analysis: Union[None, Dict],
    ):
        self._model_analysis = model_analysis
        self._perf_analysis = perf_analysis
        self._loss_analysis = loss_analysis
        self._baseline_time = (
            perf_analysis["baseline"]["model"]["measurement"] if perf_analysis else None
        )
        self._baseline_pruning_time = (
            perf_analysis["pruning"]["model"]["measurements"][
                perf_analysis["pruning"]["model"]["baseline_measurement_key"]
            ]
            if perf_analysis and perf_analysis["pruning"]
            else None
        )

        self._nodes = []  # type: List[_PruningNodeEvaluator]
        self._nodes_settings = {}  # type: Dict[str, _PruningNodeSetting]
        self._perf_rescaler = _PruningPointRescaler()
        self._loss_rescaler = _PruningPointRescaler()

        for node in model_analysis["nodes"]:
            if not node["prunable"]:
                continue

            pruning_node = _PruningNodeEvaluator(
                node["id"], model_analysis, perf_analysis, loss_analysis
            )
            self._nodes.append(pruning_node)
            self._nodes_settings[pruning_node.node_id] = _PruningNodeSetting()

            if pruning_node.available_series_perf.data:
                self._perf_rescaler.add_rescale_series(
                    pruning_node.available_series_perf.value_optimized_min,
                    pruning_node.available_series_perf.value_optimized_max,
                )

            if pruning_node.available_series_loss.data:
                self._loss_rescaler.add_rescale_series(
                    pruning_node.available_series_loss.value_optimized_min,
                    pruning_node.available_series_loss.value_optimized_max,
                )

    def eval_baseline(self, baseline_sparsity: float):
        """
        Evaluate the baseline (no performance data, only loss) recommended sparsities
        to assign for each node to best maximize recovery.

        :param baseline_sparsity: the baseline_sparsity to use and evaluate with
        """
        node_sparsities = self._get_nodes_optimized_sparsities(
            baseline_sparsity, balance_perf_loss=1.0, settings=None
        )

        for node_id, sparsity in node_sparsities.items():
            self._nodes_settings[node_id].baseline_sparsity = sparsity

    def eval_pruning(self, settings: PruningSettings):
        """
        Evaluate the model to assign the evaluate sparsity levels for each node
        in the model given the input pruning settings.

        :param settings: the pruning settings to use and evaluate with
        """
        node_sparsities = self._get_nodes_optimized_sparsities(
            settings.sparsity, settings.balance_perf_loss, settings
        )

        for node in self._nodes:
            self._nodes_settings[node.node_id].sparsity = node_sparsities[node.node_id]
            self._nodes_settings[node.node_id].overridden = False

    def apply_node_overrides(self, node_overrides: List[Dict[str, Any]]):
        """
        Apply any node override sparsity levels to the current evaluated nodes.
        Must be called after eval_pruning if eval_pruning is invoked at all
        to have any effect.

        :param node_overrides: the override sparsity levels for nodes to set with
        """
        for override in node_overrides:
            self._nodes_settings[override["node_id"]].sparsity = override["sparsity"]
            self._nodes_settings[override["node_id"]].overridden = True

    def to_dict_values(self) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Create the dictionary values containing the recommended sparsity levels
        for pruning and their estimated times.
        eval_baseline and (eval_pruning and/or apply_node_overrides)
        must be called before

        :return: a tuple containing (model info, list of node info)
        """
        node_values = []

        for node in self._nodes:
            settings = self._nodes_settings[node.node_id]
            node_values.append(
                node.eval_dict(
                    settings.sparsity, settings.baseline_sparsity, settings.overridden
                )
            )

        recoveries = [
            node["est_recovery"]
            for node in node_values
            if node["est_recovery"] is not None
        ]
        loss_sensitivities = [
            node["est_loss_sensitivity"]
            for node in node_values
            if node["est_loss_sensitivity"] is not None
        ]
        perf_sensitivities = [
            node["est_perf_sensitivity"]
            for node in node_values
            if node["est_perf_sensitivity"] is not None
        ]
        est_time_deltas = [
            node["est_time_baseline"] - node["est_time"]
            for node in node_values
            if node["est_time_baseline"] is not None and node["est_time"] is not None
        ]
        params_baseline = [
            node["params_baseline"]
            for node in node_values
            if node["params_baseline"] is not None
        ]
        flops_baseline = [
            node["flops_baseline"]
            for node in node_values
            if node["flops_baseline"] is not None
        ]
        params = [node["params"] for node in node_values if node["params"] is not None]
        flops = [node["flops"] for node in node_values if node["flops"] is not None]

        if est_time_deltas and self._baseline_time and self._baseline_pruning_time:
            est_pruning_time = (
                self._baseline_pruning_time - numpy.sum(est_time_deltas).item()
            )
            est_time = self._baseline_time * (
                est_pruning_time / self._baseline_pruning_time
            )
            est_time_gain = self._baseline_time / est_time
        else:
            est_time = None
            est_time_gain = None

        params_baseline = sum(params_baseline)
        params = sum(params)
        compression = params_baseline / params if params and params_baseline else None

        flops_baseline = sum(flops_baseline)
        flops = sum(flops)
        flops_gain = flops_baseline / flops if flops and flops_baseline else None

        model_values = {
            "est_recovery": numpy.average(recoveries).item() if recoveries else None,
            "est_loss_sensitivity": (
                numpy.average(loss_sensitivities).item() if loss_sensitivities else None
            ),
            "est_perf_sensitivity": (
                numpy.average(perf_sensitivities).item() if perf_sensitivities else None
            ),
            "est_time": est_time,
            "est_time_baseline": self._baseline_time,
            "est_time_gain": est_time_gain,
            "params_baseline": params_baseline,
            "params": params,
            "compression": compression,
            "flops_baseline": flops_baseline,
            "flops": flops,
            "flops_gain": flops_gain,
        }

        return node_values, model_values

    def _get_nodes_optimized_sparsities(
        self,
        sparsity: float,
        balance_perf_loss: float,
        settings: Union[None, PruningSettings],
    ) -> Dict[str, Union[float, None]]:
        sparsities = {node.node_id: None for node in self._nodes}
        nodes_costs = self._optimize_sparsity_get_costs(balance_perf_loss)

        if not nodes_costs:
            return sparsities

        self._optimize_sparsity_update_from_costs(sparsities, nodes_costs, sparsity)
        self._optimize_sparsity_update_from_restrictions(sparsities, settings)

        return sparsities

    def _optimize_sparsity_get_costs(
        self, balance_perf_loss: float
    ) -> List[_PruningNodeSeriesValue]:
        nodes_costs = []

        for index, node in enumerate(self._nodes):
            costs = node.optimization_costs(
                balance_perf_loss,
                self._perf_rescaler,
                self._loss_rescaler,
            )

            # make sure we have sensitivity data for the node to add for consideration
            if costs and costs[-1].value is not None:
                nodes_costs.extend(costs)

        return nodes_costs

    def _optimize_sparsity_update_from_costs(
        self,
        sparsities: Dict[str, Union[float, None]],
        costs: List[_PruningNodeSeriesValue],
        sparsity: float,
    ):
        # all costs are assumed to be on the same scale across layers,
        # normalized, and always increasing.
        # therefore we can simply sort by the values to get the desired sparsity dist
        costs.sort(key=lambda c: c.value)
        total_params = sum([node.num_params for node in self._nodes])
        target_sparse_params = sparsity * total_params
        sparse_params = defaultdict(lambda: 0)

        for index, cost in enumerate(costs):
            sparse_params[cost.node_id] = cost.sparse_params
            current_sparse_params = sum(sparse_params.values())

            if current_sparse_params > target_sparse_params:
                break

            # if we're not above our sparse param target, set the sparsity for the node
            sparsities[cost.node_id] = cost.sparsity

    def _optimize_sparsity_update_from_restrictions(
        self,
        sparsities: Dict[str, Union[float, None]],
        settings: Union[None, PruningSettings],
    ):
        for index, node in enumerate(self._nodes):
            node_id = node.node_id
            sparsity = sparsities[node_id]

            if sparsity is None:
                continue

            # clip the max sparsity for everything
            if sparsity > PruningModelEvaluator.MAX_NODE_SPARSITY:
                sparsities[node_id] = PruningModelEvaluator.MAX_NODE_SPARSITY

            # if there aren't any pruning settings provided, then don't filter
            # the desired sparsities
            if settings is None:
                continue

            if index == 0 or node.structurally_pruned:
                # skip the first node in a graph since this is almost always '
                # one of the most sensitive for loss.
                # additionally skip any structurally pruned nodes (group convolutions)
                # since those already have removed connections
                sparsities[node.node_id] = None
                continue

            # if the desired sparsity is too low for any of the filters metrics
            # (minimum sparsity, minimum perf gain, minimum recovery)
            # then set to None so we don't prune the layer that didn't reach
            # a high enough sparsity for the desired effects
            baseline_sparsity = self._nodes_settings[node_id].baseline_sparsity
            est_perf_gain = node.available_series_perf.estimated_gain(sparsity)
            est_recovery = node.recovery(sparsity, baseline_sparsity)

            if (
                (
                    settings.filter_min_sparsity
                    and sparsities[node.node_id] < settings.filter_min_sparsity
                )
                or (
                    settings.filter_min_perf_gain
                    and est_perf_gain is not None
                    and est_perf_gain < settings.filter_min_perf_gain
                )
                or (
                    settings.filter_min_recovery
                    and est_recovery is not None
                    and est_recovery < settings.filter_min_recovery
                )
            ):
                sparsities[node_id] = None
