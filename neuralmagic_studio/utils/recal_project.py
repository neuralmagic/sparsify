import os
import json
from typing import List, Dict

from neuralmagic_studio.utils.perf_sparse_analysis import PerfAnalysis
from neuralmagic_studio.utils.config import ProjectConfig
from neuralmagic_studio.utils.models import RecalModel

__all__ = ["RecalProject"]


class RecalProject:
    def __init__(self, path: str):
        self._model = RecalModel(os.path.join(path, "model.onnx"))
        self._path = path
        self._config = ProjectConfig(self._path)

        os.makedirs(self.perf_folder, exist_ok=True)

    @property
    def model(self):
        return self._model

    @property
    def config(self) -> ProjectConfig:
        return self._config

    @property
    def prunable_layers(self) -> List[Dict]:
        return self._model.prunable_layers

    @property
    def sparse_analysis_loss_approx(self) -> List[Dict]:
        return self._model.sparse_analysis_loss_approx

    @property
    def sparse_analysis_perf_approx(self) -> List[Dict]:
        return self._model.sparse_analysis_perf_approx

    @property
    def sparse_analysis_perf(self) -> List[Dict]:
        return self.get_sparse_analysis_perf()

    @property
    def perf_folder(self) -> str:
        return os.path.join(self._path, "sparse-analysis/perf")

    @property
    def onnx_path(self) -> str:
        return os.path.join(self._path, "model.onnx")

    def run_sparse_analysis_perf(self, perf_file: str) -> List[Dict]:
        self.model.run_sparse_analysis_perf(
            os.path.join(self.perf_folder, f"{perf_file}.json"),
        )
        return self.get_sparse_analysis_perf(perf_file)

    def write_sparse_analysis_perf(self, perf_file: str, content: dict) -> List[Dict]:
        if perf_file == "approx":
            raise Exception("Cannot name perf file: approx")
        perf_path = os.path.join(self.perf_folder, f"{perf_file}.json")
        PerfAnalysis.write(perf_path, content)
        return self.get_sparse_analysis_perf(perf_file)

    def get_sparse_analysis_perf(self, perf_file: str = None) -> List[Dict]:
        if perf_file is None:
            perf_files = sorted(
                [
                    os.path.join(self.perf_folder, perf_json)
                    for perf_json in os.listdir(self.perf_folder)
                    if ".json" in perf_json
                ],
                key=lambda perf_file: os.path.getctime(perf_file),
            )
            if len(perf_files) > 0:
                return PerfAnalysis(perf_files[0]).get_perf_info(
                    self.model.prunable_nodes
                )
            else:
                raise FileNotFoundError(f"No perf files exist for {self.config.id}")

        else:
            return PerfAnalysis(
                os.path.join(self.perf_folder, f"{perf_file}.json")
            ).get_perf_info(self.model.prunable_nodes)
