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


import doctest
import logging
from pathlib import Path

from sparsezoo.analyze import ModelAnalysis


__all__ = [
    "create_analysis_file",
    "get_non_existent_yaml_filename",
    "set_log_level",
    "strtobool",
]
_MAP = {
    "y": True,
    "yes": True,
    "t": True,
    "true": True,
    "on": True,
    "1": True,
    "n": False,
    "no": False,
    "f": False,
    "false": False,
    "off": False,
    "0": False,
}


def strtobool(value):
    """
    Emulation of distutils.strtobool since it is deprecated and will be removed
    by Python3.12

    :param value: a str convertible value to be converted to bool
    :returns: a bool representation of the value
    """
    try:
        return _MAP[str(value).lower()]
    except KeyError:
        raise ValueError('"{}" is not a valid bool value'.format(value))


def set_log_level(logger: logging.Logger, level: int) -> None:
    """
    Set the log level for the given logger and all of its handlers

    :param logger: The logger to set the level for
    :param level: The level to set the logger to
    """
    logging.basicConfig(level=level)
    for handler in logger.handlers:
        handler.setLevel(level=level)


def get_non_existent_yaml_filename(
    working_dir: Path, filename: str = "analysis"
) -> Path:
    """
    Get a filename that does not exist in the given directory

    >>> get_non_existent_yaml_filename(Path("/tmp"), "analysis")
    PosixPath('/tmp/analysis.yaml')

    :param working_dir: The directory to check for the `filename.yaml`
    :param filename: The filename to check for, without `.yaml` extension
    :return: The filename that does not exist in the given directory.
        Note: the returned filename will include a `.yaml` extension
    """
    if not working_dir.exists():
        return working_dir.joinpath(filename)

    i = 1
    while working_dir.joinpath(filename).with_suffix(".yaml").exists():
        filename = f"{filename}_{i}"
        i += 1

    return working_dir.joinpath(filename).with_suffix(".yaml")


def create_analysis_file(working_dir: str, model: str) -> str:
    """
    Run model analysis and save the analysis yaml file.

    :param working_dir: dir Path to save the model analysis yaml file.
    :param model: Path to model file, or SparseZoo stub.
    :return: str path to the analysis yaml file.
    """
    working_dir = Path(working_dir)
    working_dir.mkdir(parents=True, exist_ok=True)
    analysis_file_path = str(
        get_non_existent_yaml_filename(working_dir=working_dir, filename="analysis")
    )
    analysis = ModelAnalysis.create(model)
    analysis.yaml(file_path=analysis_file_path)
    return analysis_file_path


if __name__ == "__main__":
    doctest.testmod()
