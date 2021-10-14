# FROM tensorflow/tfx:1.0.0
FROM gcr.io/tfx-oss-public/tfx:1.3.0
WORKDIR /pipeline
COPY ./ ./
RUN pip install tensorflow-recommenders
ENV PYTHONPATH="/pipeline:${PYTHONPATH}"
