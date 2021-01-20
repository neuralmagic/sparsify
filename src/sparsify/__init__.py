"""
Code for handling the server portions of sparsify to benchmark and optimize
neural networks
"""

# flake8: noqa
from .app import *

# be sure to import all logging first and at the root
# this keeps other loggers in nested files creating from the root logger setups
from .log import *
