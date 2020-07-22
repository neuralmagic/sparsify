import argparse
import logging
import os
import sys
from typing import Any, Callable, Dict, List

from flask import Flask
from flask_cors import CORS
from neuralmagic_studio.server import setup_flask

app = Flask(__name__, static_url_path="", template_folder="static")
CORS(app)

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

    _subparser_flask(subparsers)

    parse_args = parser.parse_args()

    logging.getLogger().setLevel(logging.INFO)

    kwargs = vars(parse_args)
    command = parse_args.command
    del kwargs["command"]

    if command == NM_STUDIO_SERVER_COMMAND:
        setup_flask(app, **kwargs)

    else:
        raise Exception(f"No command provided")


if __name__ == "__main__":
    main()
