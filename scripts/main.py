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
Main Sparsify server script. Runs the sparsify server.


##########
Command help:
python scripts/main.py -h
usage: main.py [-h] [--working-dir WORKING_DIR] [--host HOST] [--port PORT]
               [--debug] [--logging-level LOGGING_LEVEL] [--ui-path UI_PATH]

sparsify

optional arguments:
  -h, --help            show this help message and exit
  --working-dir WORKING_DIR
                        The path to the working directory to store state in,
                        defaults to ~/sparsify
  --host HOST           The host path to launch the server on
  --port PORT           The local port to launch the server on
  --debug               Set to run in debug mode
  --logging-level LOGGING_LEVEL
                        The logging level to report at
  --ui-path UI_PATH     The directory to render the UI from, generally should
                        not be set. By default, will load from the UI packaged
                        with sparsify under sparsify/ui

##########
Example command for running Sparsify with default settings
python3 scripts/main.py

Example command for running Sparisfy on a specific host and port
python3 scripts/main.py --host 127.0.0.1 --port 3000

Example command for running Sparsify and storing defaults in a specific directory
python3 scripts/main.py --working-dir ~/Desktop/sparsify
"""


import sparsify


if __name__ == "__main__":
    sparsify.main()
