from pathlib import Path
from typing import Dict

from sparsify.package_.utils import _download_directory_from_stub  # noqa
import pytest

_CV_STUBS = [
    "zoo:cv/classification/resnet_v1-50/pytorch/sparseml/imagenet/pruned95_quant-none",
]

_NLP_STUBS = [
    "zoo:nlp/question_answering/bert-base/pytorch/huggingface/squad"
    "/pruned95_obs_quant-none"
]

_BASE_FILES = {"model.onnx"}
_ALL_FILES = _BASE_FILES.union(
    ("config.json", "tokenizer.json")
)

_STUBS_AND_EXPECTED_FILES = [(_stub, _BASE_FILES) for _stub in _CV_STUBS]
_STUBS_AND_EXPECTED_FILES.extend((_stub, _ALL_FILES) for _stub in _NLP_STUBS)


def _get_file_dict(folder_path: str, recursive: bool = True, ) -> Dict[str, str]:
    """
    Returns a mapping of filename --> absolute file path, for
    all files within a given folder; note searches for files
    recursively by default

    :param folder_path: Path to a directory
    :param recursive: if Truthy then folder_path is searched recursively
    """
    folder_path = Path(folder_path)
    file_dict = {}
    for file in folder_path.iterdir():
        if file.is_file():
            file_dict[file.name] = file.absolute()
        elif recursive:
            file_dict.update(_get_file_dict(file, recursive=recursive))
    return file_dict


@pytest.mark.parametrize(
    "stub, expected_files", _STUBS_AND_EXPECTED_FILES
)
def test_model_directory_exists(stub, expected_files):
    model_dir = _download_directory_from_stub(stub)

    assert isinstance(model_dir, str)
    assert Path(model_dir).is_dir()

    downloaded_files = _get_file_dict(folder_path=model_dir)

    for filename in expected_files:
        assert filename in downloaded_files
