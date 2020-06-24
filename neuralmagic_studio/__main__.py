import argparse
import logging
import os
import sys
from typing import Any, Callable, Dict, List

from flask import Flask
from flask_cors import CORS
from neuralmagic_studio.cli_api import (
    add_sparse_analysis_loss,
    add_sparse_analysis_perf,
    create_project,
    run_sparse_analysis_loss,
    run_sparse_analysis_perf,
)
from neuralmagic_studio.server import setup_flask

app = Flask(__name__, static_url_path="", template_folder="static")
CORS(app)

SPARSE_ANALYSIS_LOSS_COMMAND = "sparse-loss"
SPARSE_ANALYSIS_PERF_COMMAND = "sparse-perf"
CREATE_PROJECT_COMMAND = "create-project"
ADD_SPARSE_ANALYSIS_LOSS_COMMAND = "add-sparse-loss"
ADD_SPARSE_ANALYSIS_PERF_COMMAND = "add-sparse-perf"
NM_STUDIO_SERVER_COMMAND = "server"


def _add_project_root_parser(parser):
    parser.add_argument(
        "--project-root",
        type=str,
        default=None,
        help="Root directory where files are stored",
    )


def _add_project_parser(parser):
    parser.add_argument("project_id", type=str, help="Project ID")
    _add_project_root_parser(parser)


def _add_sparsity_level_parser(parser):
    parser.add_argument(
        "--sparsity-levels", "-s", type=float, nargs="+", help="List of sparsity levels"
    )


def _add_batch_size_parser(parser):
    parser.add_argument(
        "--batch-size",
        "-b",
        type=int,
        default=1,
        help="Batch size of model input. Default 1",
    )


def _subparser_sparse_loss(subparsers):
    """
    Running sparse perf command subparser

    e.g.
    sparse-perf 12345-67890 --loss-file default --samples-per-measurement 5 \
        --batch-size 4 --sparsity-levels 0 0.4 0.6 0.7 0.9

    :param subparsers: ArgumentParser handling subparsing
    """
    subparser = subparsers.add_parser(
        SPARSE_ANALYSIS_LOSS_COMMAND, help="Run sparse perf analysis"
    )

    _add_project_parser(subparser)
    _add_sparsity_level_parser(subparser)
    _add_batch_size_parser(subparser)

    subparser.add_argument(
        "--loss-file",
        "-f",
        type=str,
        required=True,
        help="File name to save loss analysis",
    )

    subparser.add_argument(
        "--samples-per-measurement",
        "-m",
        type=int,
        default=5,
        help="Amount of batches to run when running sparse analysis. Default 5",
    )


def _subparser_add_sparse_loss(subparsers):
    """
    Add sparse loss command subparser

    e.g.
    If reading from a file
    add-sparse-loss 12345-67890 --loss-file default -src ~/Downloads/loss.yaml

    If using content
    add-sparse-loss 12345-67890 --loss-file default --content "{ 'test': 'test' }"

    :param subparsers: ArgumentParser handling subparsing
    """
    subparser = subparsers.add_parser(
        ADD_SPARSE_ANALYSIS_LOSS_COMMAND, help="Add sparse perf analysis"
    )

    _add_project_parser(subparser)

    subparser.add_argument(
        "--loss-file",
        "-f",
        type=str,
        required=True,
        help="File name to save loss analysis",
    )

    subparser.add_argument(
        "--source",
        "-src",
        type=str,
        default=None,
        help="Source file to read analysis from",
    )
    subparser.add_argument(
        "--content",
        type=str,
        default=None,
        help="Content to save to analysis. Will be ignored if 'source' is provided",
    )


def _subparser_sparse_perf(subparsers):
    """
    Running sparse perf command subparser

    e.g.
    sparse-perf 12345-67890 -perf-file default --optimization-level 0 --num-cores 4 \
        --num-warmup-iterations 5 --num-iterations 30 --batch-size 4 \
        --sparsity-levels 0 0.4 0.6 0.7 0.9

    :param subparsers: ArgumentParser handling subparsing
    """
    subparser = subparsers.add_parser(
        SPARSE_ANALYSIS_PERF_COMMAND, help="Run sparse perf analysis"
    )

    _add_project_parser(subparser)
    _add_sparsity_level_parser(subparser)
    _add_batch_size_parser(subparser)

    subparser.add_argument(
        "--perf-file",
        "-f",
        type=str,
        required=True,
        help="File name to save perf analysis",
    )

    subparser.add_argument(
        "--optimization-level",
        "-o",
        type=int,
        default=0,
        help="Level of optimization in benchmarking",
    )

    subparser.add_argument(
        "--num-cores",
        "-c",
        type=int,
        default=None,
        help="Number of cores used for benchmarking",
    )

    subparser.add_argument(
        "--num-warmup-iterations",
        "-w",
        type=int,
        default=5,
        help="Number of warm up iterations before benchmarking starts",
    )

    subparser.add_argument(
        "--num-iterations",
        "-i",
        type=int,
        default=30,
        help="Number of iterations to run for benchmarking",
    )


def _subparser_add_sparse_perf(subparsers):
    """
    Add sparse perf command subparser

    e.g.
    If reading from a file
    add-sparse-perf 12345-67890 --perf-file default -src ~/Downloads/perf.yaml

    If using content
    add-sparse-perf 12345-67890 -perf-file default --content "{ 'test': 'test' }"

    :param subparsers: ArgumentParser handling subparsing
    """
    subparser = subparsers.add_parser(
        ADD_SPARSE_ANALYSIS_PERF_COMMAND, help="Add sparse perf analysis"
    )

    _add_project_parser(subparser)

    subparser.add_argument(
        "--perf-file",
        "-f",
        type=str,
        required=True,
        help="File name to save perf analysis",
    )

    subparser.add_argument(
        "--source",
        "-src",
        type=str,
        default=None,
        help="Source file to read analysis from",
    )
    subparser.add_argument(
        "--content",
        type=str,
        default=None,
        help="Content to save to analysis. Will be ignored if 'source' is provided",
    )


def _subparser_create_project(subparsers):
    """
    Create project command subparser

    e.g.
    create-project --model-path ~/Downloads/model.onnx --project-name test_project

    :param subparsers: ArgumentParser handling subparsing
    """
    subparser = subparsers.add_parser(CREATE_PROJECT_COMMAND, help="Create projects")

    subparser.add_argument(
        "--model-path", type=str, required=True, help="Path of source model"
    )
    subparser.add_argument(
        "--project-name", type=str, required=True, help="Name of project"
    )

    _add_project_root_parser(subparser)


def _subparser_flask(subparsers):
    """
    Run flask server

    e.g.
    server 12345-67890 --project-root ~/nm-projects --host 127.0.0.1 --port 7899 --logging-level WARNING
    :param subparsers: ArgumentParser handling subparsing
    """
    subparser = subparsers.add_parser(
        NM_STUDIO_SERVER_COMMAND, help="Neural Magic Studio Server"
    )

    subparser.add_argument("--project-root", default=None)
    subparser.add_argument("--host", default="0.0.0.0", type=str)
    subparser.add_argument("--port", default=7890, type=int)
    subparser.add_argument("--logging-level", default="WARNING", type=str)


def main():
    parser = argparse.ArgumentParser(prog="Neuralmagic Studio")

    subparsers = parser.add_subparsers(
        help="available commands for neuralmagic studio", dest="command"
    )

    _subparser_add_sparse_loss(subparsers)
    _subparser_add_sparse_perf(subparsers)
    _subparser_create_project(subparsers)
    _subparser_flask(subparsers)
    _subparser_sparse_loss(subparsers)
    _subparser_sparse_perf(subparsers)

    parse_args = parser.parse_args()

    logging.getLogger().setLevel(logging.INFO)

    kwargs = vars(parse_args)
    command = parse_args.command
    del kwargs["command"]

    if command == NM_STUDIO_SERVER_COMMAND:
        setup_flask(app, **kwargs)

    elif command == SPARSE_ANALYSIS_LOSS_COMMAND:
        run_sparse_analysis_loss(**kwargs)

    elif command == SPARSE_ANALYSIS_PERF_COMMAND:
        run_sparse_analysis_perf(**kwargs)

    elif command == CREATE_PROJECT_COMMAND:
        create_project(**kwargs)

    elif command == ADD_SPARSE_ANALYSIS_LOSS_COMMAND:
        add_sparse_analysis_loss(**kwargs)

    elif command == ADD_SPARSE_ANALYSIS_PERF_COMMAND:
        add_sparse_analysis_perf(**kwargs)

    else:
        raise Exception(f"No command provided")


if __name__ == "__main__":
    main()
