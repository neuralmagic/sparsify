FROM neuralmagic-docker-base:latest

COPY . /home/nm_user/nm-studio
RUN pip3 install /home/nm_user/nm-studio