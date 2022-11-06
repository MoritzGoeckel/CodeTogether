FROM python:3.8

RUN pip install Flask waitress

RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm

RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

RUN echo "Node version: " && node --version

RUN apt-get install -y sudo
RUN apt-get install -y vim

ENV SRC_DIR /usr/bin/src/webapp/src
ENV COMPILE_DIR /tmp/compilations

RUN mkdir ${COMPILE_DIR}

COPY src/* ${SRC_DIR}/
WORKDIR ${SRC_DIR}

#RUN apt-get install acl

RUN useradd --no-user-group --no-create-home -s /bin/bash compile_user
#RUN setfacl -R -m u:compile_user:rx ${SRC_DIR}
#RUN setfacl -R -m u:compile_user:rwx ${COMPILE_DIR}
RUN chown -R compile_user ${COMPILE_DIR}
RUN chmod oug+rx ${COMPILE_DIR}

RUN useradd --no-user-group --no-create-home -s /bin/bash run_user
#RUN setfacl -R -m u:run_user:rx ${COMPILE_DIR}

RUN echo 'compile_user ALL=(run_user) NOPASSWD:ALL' >> /etc/sudoers

USER compile_user
ENV PYTHONUNBUFFERED=1

CMD ["python", "server.py"]
