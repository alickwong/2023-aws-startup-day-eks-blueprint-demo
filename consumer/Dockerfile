FROM  pytorch/pytorch:1.13.0-cuda11.6-cudnn8-runtime

COPY requirements.txt /requirements.txt
RUN python3 --version
RUN pip install --user -r /requirements.txt

COPY src /app
RUN mkdir /output
ADD hf_cache /hf_cache
WORKDIR /app

ENV HF_HOME=/hf_cache
CMD python -u infer_sd14.py

