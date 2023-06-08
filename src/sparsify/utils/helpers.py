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
import shutil
from pathlib import Path
from typing import Optional, Union

import yaml

from pydantic import BaseModel
from sparsezoo.analyze import ModelAnalysis


__all__ = [
    "base_model_to_yaml",
    "copy",
    "create_analysis_file",
    "get_non_existent_filename",
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

_LOGGER = logging.getLogger(__name__)


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


def get_non_existent_filename(
    parent_dir: Path, filename: str = "analysis.yaml"
) -> Path:
    """
    Get a filename that does not exist in the given directory,
    if filename exists, append _1, _2, etc. until a filename
    that does not exist is found. if filename includes an extension,
    the extension will be preserved.


    >>> get_non_existent_filename(Path("/tmp"), "analysis")
    PosixPath('/tmp/analysis')

    >>> get_non_existent_filename(Path("/tmp"), "analysis.yaml")
    PosixPath('/tmp/analysis.yaml')

    :param parent_dir: The directory to check for the `filename`
    :param filename: The filename to check for, if it includes an extension,
        the extension will be preserved. Default: "analysis.yaml"
    :return: The filename that does not exist in the given directory.
    """
    if not parent_dir.exists():
        return parent_dir.joinpath(filename)

    i = 1
    while parent_dir.joinpath(filename).exists():
        suffix = Path(filename).suffix
        filename = f"{Path(filename).stem}_{i}"
        if suffix:
            filename = Path(filename).with_suffix(suffix=suffix)
        i += 1

    return parent_dir.joinpath(filename)


def create_analysis_file(working_dir: str, model: str) -> str:
    """
    Run model analysis and save the analysis yaml file.

    :param working_dir: dir Path to save the model analysis yaml file.
    :param model: Path to model file, or SparseZoo stub.
    :return: str path to the analysis yaml file.
    """
    working_dir: Path = Path(working_dir)
    working_dir.mkdir(parents=True, exist_ok=True)
    analysis_file_path = str(
        get_non_existent_filename(parent_dir=working_dir, filename="analysis.yaml")
    )
    analysis = ModelAnalysis.create(model)
    analysis.yaml(file_path=analysis_file_path)
    return analysis_file_path


def base_model_to_yaml(
    model: BaseModel, file_path: Optional[str] = None
) -> Union[str, None]:
    """
    :param model: the model to convert to yaml
    :param file_path: optional file path to save yaml to
    :return: if file_path is not given, the state of the analysis model
        as a yaml string, otherwise None
    """
    file_stream = None if file_path is None else open(file_path, "w")
    ret = yaml.dump(
        model.dict(), stream=file_stream, allow_unicode=True, sort_keys=False
    )

    if file_stream is not None:
        file_stream.close()

    return ret


def copy(file_or_dir: Path, dest: Path) -> Path:
    """
    Copy a file or directory to a destination.

    :raises ValueError: If file_or_dir is a directory and dest is a file
    :raises FileNotFoundError: If file_or_dir does not exist
    :param file_or_dir: The file or directory to copy
    :param dest: The destination to copy to
    :return: The destination path
    """
    if not file_or_dir.exists():
        raise FileNotFoundError(
            f"Cannot copy {file_or_dir} to {dest}, {file_or_dir} does not exist"
        )

    if file_or_dir.is_dir():
        # rely on suffix to determine if dest is a file or directory
        #  as pathlib is_file() method will return false if dest does not exist
        if dest.suffix != "":
            raise ValueError(
                f"Cannot copy directory {file_or_dir} to file {dest}, "
                "destination must also be a directory"
            )
        shutil.copytree(file_or_dir, dest)
    else:
        shutil.copy(file_or_dir, dest)

    return dest / file_or_dir.name


if __name__ == "__main__":
    doctest.testmod()
