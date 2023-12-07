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
from typing import Dict, List, Tuple

from setuptools import find_packages, setup


# default variables to be overwritten by the version.py file
is_release = None
version = "unknown"
version_major_minor = version

# load and overwrite version and release info from sparseml package
exec(open(os.path.join("src", "sparsify", "version.py")).read())
print(f"loaded version {version} from src/sparsify/version.py")

_PACKAGE_NAME = "sparsify" if is_release else "sparsify-nightly"

_deps = [
    "pydantic>=1.8.2,<2.0.0",
    "pyyaml>=5.0.0",
    "click~=8.0.0",
    "tensorboard>=2.0.0",
    "setuptools>=56.0.0",
    "optuna>=3.0.2",
    "onnxruntime-gpu",
]

_nm_deps = [
    f"{'sparsezoo' if is_release else 'sparsezoo-nightly'}~={version_major_minor}",
    f"{'deepsparse' if is_release else 'deepsparse-nightly'}~={version_major_minor}",
    f"{'sparseml' if is_release else 'sparseml-nightly'}[torchvision,yolov5]~={version_major_minor}",  # noqa E501
]

_dev_deps = [
    "black>=20.8b1",
    "flake8>=3.8.3",
    "isort>=5.7.0",
    "pytest>=6.0.0",
    "wheel>=0.36.2",
    "fastai>=2.7.7",
]

_llm_deps = [
    "llm-foundry==0.2.0",
    f"{'nm-transformers' if is_release else 'nm-transformers-nightly'}",
]


def _setup_packages() -> List:
    return find_packages(
        "src", include=["sparsify", "sparsify.*"], exclude=["*.__pycache__.*"]
    )


def _setup_package_dir() -> Dict:
    return {"": "src"}


def _setup_install_requires() -> List:
    return _nm_deps + _deps


def _setup_extras() -> Dict:
    return {"dev": _dev_deps, "nm": _nm_deps, "llm": _llm_deps}


def _setup_entry_points() -> Dict:
    return {
        "console_scripts": [
            "sparsify.run=sparsify.cli.run:main",
            "sparsify.login=sparsify.login:main",
            "sparsify.check_environment=sparsify.check_environment.main:main",
            "sparsify.llm_finetune=sparsify.auto.tasks.finetune.finetune:parse_args_and_run",  # noqa E501
            "sparisfy.llama_export=sparsify.auto.tasks.transformers.llama:llama_export",
        ]
    }


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
    python_requires=">=3.8.0",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Intended Audience :: Developers",
        "Intended Audience :: Education",
        "Intended Audience :: Information Technology",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: POSIX :: Linux",
        "Topic :: Scientific/Engineering",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Scientific/Engineering :: Mathematics",
        "Topic :: Software Development",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
)
