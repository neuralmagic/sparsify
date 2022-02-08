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

import os
from sys import platform
from typing import Dict, List, Tuple

from setuptools import find_packages, setup


# default variables to be overwritten by the version.py file
is_release = None
version = "unknown"
version_major_minor = version

# load and overwrite version and release info from sparseml package
exec(open(os.path.join("src", "sparsify", "version.py")).read())
print(f"loaded version {version} from src/sparsify/version.py")
version_nm_deps = f"{version_major_minor}.0"

_PACKAGE_NAME = "sparsify" if is_release else "sparsify-nightly"


_deps = [
    "apispec>=3.0.0",
    "flasgger>=0.9.0",
    "Flask>=1.0.0",
    "Flask-Cors>=3.0.0",
    "marshmallow>=3.0.0",
    "peewee>=3.0.0",
]

_nm_deps = [
    f"{'sparsezoo' if is_release else 'sparsezoo-nightly'}~={version_nm_deps}",
    f"{'sparseml' if is_release else 'sparseml-nightly'}~={version_nm_deps}",
]


_dev_deps = [
    "beautifulsoup4==4.9.3",
    "black>=20.8b1",
    "flake8>=3.8.3",
    "isort>=5.7.0",
    "m2r2~=0.2.7",
    "mistune==0.8.4",
    "myst-parser~=0.14.0",
    "rinohtype>=0.4.2",
    "sphinx>=3.4.0",
    "sphinx-copybutton>=0.3.0",
    "sphinx-markdown-tables>=0.0.15",
    "sphinx-multiversion==0.2.4",
    "sphinx-rtd-theme",
    "pytest>=6.0.0",
    "wheel>=0.36.2",
]

if platform == "linux" or platform == "linux2":
    _deps.extend(["pysqlite3-binary>=0.4.0"])


def _setup_packages() -> List:
    return find_packages(
        "src", include=["sparsify", "sparsify.*"], exclude=["*.__pycache__.*"]
    )


def _setup_package_dir() -> Dict:
    return {"": "src"}


def _setup_install_requires() -> List:
    return _nm_deps + _deps


def _setup_extras() -> Dict:
    return {"dev": _dev_deps}


def _setup_entry_points() -> Dict:
    return {"console_scripts": ["sparsify=sparsify.app:main"]}


def _setup_long_description() -> Tuple[str, str]:
    return open("README.md", "r", encoding="utf-8").read(), "text/markdown"


setup(
    name=_PACKAGE_NAME,
    version=version,
    author="Neuralmagic, Inc.",
    author_email="support@neuralmagic.com",
    description=(
        "Easy-to-use UI for automatically sparsifying neural networks and "
        "creating sparsification recipes for better inference performance and "
        "a smaller footprint"
    ),
    long_description=_setup_long_description()[0],
    long_description_content_type=_setup_long_description()[1],
    keywords=(
        "inference, machine learning, neural network, computer vision, nlp, cv, "
        "deep learning, torch, pytorch, tensorflow, keras, automl, sparsity, pruning, "
        "deep learning libraries, onnx, quantization"
    ),
    license="Apache",
    url="https://github.com/neuralmagic/sparsify",
    include_package_data=True,
    package_dir=_setup_package_dir(),
    packages=_setup_packages(),
    install_requires=_setup_install_requires(),
    extras_require=_setup_extras(),
    entry_points=_setup_entry_points(),
    python_requires=">=3.6.0",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Environment :: Console",
        "Programming Language :: Python :: 3",
        "Intended Audience :: Developers",
        "Intended Audience :: Education",
        "Intended Audience :: Information Technology",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: POSIX :: Linux",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3 :: Only",
        "Topic :: Scientific/Engineering",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Scientific/Engineering :: Mathematics",
        "Topic :: Software Development",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
)
