from sys import platform
from typing import Dict, List, Tuple

from setuptools import find_packages, setup


_deps = [
    "sparsezoo~=0.1.0",
    "sparseml~=0.1.0",
    "apispec>=3.0.0",
    "flasgger>=0.9.0",
    "Flask>=1.0.0",
    "Flask-Cors>=3.0.0",
    "marshmallow>=3.0.0",
    "peewee>=3.0.0",
]

_dev_deps = [
    "black>=20.8b1",
    "flake8>=3.8.3",
    "isort>=5.7.0",
    "rinohtype>=0.4.2",
    "sphinxcontrib-apidoc>=0.3.0",
    "wheel>=0.36.2",
    "pytest>=6.0.0",
    "sphinx-rtd-theme",
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
    return _deps


def _setup_extras() -> Dict:
    return {"dev": _dev_deps}


def _setup_entry_points() -> Dict:
    return {"console_scripts": ["sparsify=sparsify.app:main"]}


def _setup_long_description() -> Tuple[str, str]:
    return open("README.md", "r", encoding="utf-8").read(), "text/markdown"


setup(
    name="sparsify",
    version="0.1.0",
    author="Mark Kurtz, Kevin Rodriguez, Ben Fineran, Tuan Nguyen, Dan Alistarh",
    author_email="support@neuralmagic.com",
    description="Easy-to-use interface to automatically prune and optimize models "
    "for better performance and smaller footprint",
    long_description=_setup_long_description()[0],
    long_description_content_type=_setup_long_description()[1],
    keywords="inference machine learning neural network computer vision nlp cv "
    "deep learning torch pytorch tensorflow keras automl",
    license="[TODO]",
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
