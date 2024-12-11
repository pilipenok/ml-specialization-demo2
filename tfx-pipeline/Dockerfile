# FROM tensorflow/tfx:1.0.0
# FROM gcr.io/tfx-oss-public/tfx:1.3.1
FROM gcr.io/tfx-oss-public/tfx:1.15.1
RUN pip install tensorflow-recommenders==0.6.0

WORKDIR /pipeline
COPY ./ ./
ENV PYTHONPATH="/pipeline:${PYTHONPATH}"
