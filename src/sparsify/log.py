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
Root logging file to handle standard logging setups for the package
"""

import logging


__all__ = ["set_logging_level", "get_root_logger", "get_main_logger"]


def _create_console_stream(level: int, format_: str, datefmt: str):
    stream = logging.StreamHandler()
    stream.setLevel(level)
    formatter = logging.Formatter(format_, datefmt)
    stream.setFormatter(formatter)

    return stream


DEFAULT_LOG_LEVEL = logging.INFO

ROOT_LOGGER = logging.getLogger("sparsify")
ROOT_LOGGER.setLevel(DEFAULT_LOG_LEVEL)
ROOT_LOGGER.addHandler(
    _create_console_stream(
        DEFAULT_LOG_LEVEL,
        "%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
        "%Y-%m-%d %H:%M:%S",
    )
)

MAIN_LOGGER = logging.getLogger("__main__")
MAIN_LOGGER.setLevel(DEFAULT_LOG_LEVEL)
MAIN_LOGGER.addHandler(
    _create_console_stream(
        DEFAULT_LOG_LEVEL,
        "%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
        "%Y-%m-%d %H:%M:%S",
    )
)


def set_logging_level(level: int):
    """
    Set the logging level for the MAIN and ROOT loggers along with all
    loggers created in the sparsify namespace

    :param level: the log level to set; ex: logging.INFO
    """
    ROOT_LOGGER.setLevel(level)
    for hand in ROOT_LOGGER.handlers:
        hand.setLevel(level)

    MAIN_LOGGER.setLevel(level)
    for hand in MAIN_LOGGER.handlers:
        hand.setLevel(level)


def get_root_logger() -> logging.Logger:
    """
    :return: the logger used for the sparsify root package that all
        other loggers in that namespace are created from
    """
    return ROOT_LOGGER


def get_main_logger() -> logging.Logger:
    """
    :return: a main logger that can be used in external scripts for logging
        in a standard format that is consistent with other loggers in sparsify
    """
    return MAIN_LOGGER
