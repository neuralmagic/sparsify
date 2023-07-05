FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu20.04

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install --no-install-recommends -y \
    git python3 python3-dev python3-venv python3-pip python3-wheel build-essential && \
	apt-get clean && rm -rf /var/lib/apt/lists/*


ARG REF=main
RUN git clone https://github.com/neuralmagic/sparsify && cd sparsify && git checkout $REF
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install --no-cache-dir -e ./sparsify

CMD ["/bin/bash"]
