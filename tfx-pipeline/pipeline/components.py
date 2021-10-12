from tfx import v1 as tfx

from tfx.proto import trainer_pb2, tuner_pb2
from tfx.dsl.components.base import executor_spec
from tfx.dsl.components.common import resolver
from tfx.dsl.experimental import latest_blessed_model_resolver
import tensorflow_model_analysis as tfma

from tfx.extensions.google_cloud_ai_platform.trainer import executor as ai_platform_trainer_executor
from tfx.extensions.google_cloud_ai_platform.pusher import executor as ai_platform_pusher_executor
from tfx.extensions.google_cloud_ai_platform.trainer.executor import ENABLE_VERTEX_KEY, VERTEX_REGION_KEY, TRAINING_ARGS_KEY
from tfx.extensions.google_cloud_ai_platform.pusher.executor import VERTEX_CONTAINER_IMAGE_URI_KEY
from tfx.extensions.google_cloud_ai_platform.tuner.executor import TUNING_ARGS_KEY

from tfx import types
from typing import Optional
from tfx.types.standard_artifacts import Model, ModelBlessing
from tfx.dsl.component.experimental.decorators import component

from google.cloud import pubsub
import json

from pipeline import configs
from models.baseline import features


# Brings data into the pipeline or otherwise joins/converts training data.
def example_gen() -> tfx.components.CsvExampleGen:
    return tfx.components.CsvExampleGen(
        input_base=configs.DATA_PATH
    )


# Computes statistics over data for visualization and example validation.
def statistics_gen(
    examples: types.Channel
) -> tfx.components.StatisticsGen:
    return tfx.components.StatisticsGen(examples=examples)


# Generates schema based on statistics files.
def schema_gen(
    statistics: types.Channel
) -> tfx.components.SchemaGen:
    return tfx.components.SchemaGen(statistics=statistics, infer_feature_shape=True)


# Performs anomaly detection based on statistics and data schema.
def example_validator(
    statistics: types.Channel,
    schema: types.Channel
) -> tfx.components.ExampleValidator:
    return tfx.components.ExampleValidator(statistics=statistics, schema=schema)


# Performs transformations and feature engineering in training and serving.
def transform(
    examples: types.Channel,
    schema: types.Channel
) -> tfx.components.Transform:
    return tfx.components.Transform(
        #preprocessing_fn=configs.PREPROCESSING_FN,
        module_file=configs.MODULE_FILE,
        examples=examples,
        schema=schema,
    )


# Trains a model via Kubeflow pipelines
def trainer(
    examples: Optional[types.Channel] = None,
    schema: Optional[types.Channel] = None,
    transform_graph: Optional[types.Channel] = None,
    hyperparameters: Optional[types.Channel] = None
) -> tfx.components.Trainer:
    args = dict(
        #run_fn=configs.RUN_FN,
        module_file=configs.MODULE_FILE,
        train_args=trainer_pb2.TrainArgs(num_steps=configs.TRAIN_NUM_STEPS),
        eval_args=trainer_pb2.EvalArgs(num_steps=configs.EVAL_NUM_STEPS),
        custom_config={
            ai_platform_trainer_executor.TRAINING_ARGS_KEY: configs.GCP_AI_PLATFORM_TRAINING_ARGS
        }
    )

    if examples:
        args.update(examples=examples)
    if schema:
        args.update(schema=schema)
    if transform_graph:
        args.update(transform_graph=transform_graph)
    if hyperparameters:
        args.update(hyperparameters=hyperparameters)

    return tfx.components.Trainer(**args).with_id('Trainer')


# See https://www.tensorflow.org/tfx/tutorials/tfx/gcp/vertex_pipelines_vertex_training for tutorial example
def trainer_vertex(
    examples: Optional[types.Channel] = None,
    schema: Optional[types.Channel] = None,
    transform_graph: Optional[types.Channel] = None,
    hyperparameters: Optional[types.Channel] = None
) -> tfx.components.Trainer:
    args = dict(
        module_file=configs.MODULE_FILE,
        #run_fn=configs.RUN_FN,
        train_args=trainer_pb2.TrainArgs(num_steps=configs.TRAIN_NUM_STEPS),
        eval_args=trainer_pb2.EvalArgs(num_steps=configs.EVAL_NUM_STEPS),
        custom_config={
            ENABLE_VERTEX_KEY: True,
            VERTEX_REGION_KEY: configs.GOOGLE_CLOUD_REGION,
            TRAINING_ARGS_KEY: configs.GCP_VERTEX_AI_TRAINING_ARGS,
            'use_gpu': configs.USE_GPU,
        }
    )
    if examples:
        args.update(examples=examples)
    if schema:
        args.update(schema=schema)
    if transform_graph:
        args.update(transform_graph=transform_graph)
    if hyperparameters:
        args.update(hyperparameters=hyperparameters)

    # Trains a model using Vertex AI Training.
    return tfx.components.Trainer(**args).with_id('TrainerVertex')


# Get the latest blessed model for model validation.
def model_resolver():
    return resolver.Resolver(
        strategy_class=latest_blessed_model_resolver.LatestBlessedModelResolver,
        model=types.Channel(type=Model),
        model_blessing=types.Channel(type=ModelBlessing)
    ).with_id('latest_blessed_model_resolver')


def evaluator(
    examples: types.Channel,
    model: Optional[types.Channel] = None,
    baseline_model: Optional[types.Channel] = None
):
    # Uses TFMA to compute a evaluation statistics over features of a model and
    # perform quality validation of a candidate model (compared to a baseline).

    eval_config = tfma.EvalConfig(
        #model_specs=[tfma.ModelSpec(label_key=features.LABEL_KEY)],
        slicing_specs=[tfma.SlicingSpec()],
        metrics_specs=[
            tfma.MetricsSpec(metrics=[
                tfma.Metricconfig(class_name='RootMeanSquaredError'),
                tfma.Metricconfig(class_name='MeanAbsolutePercentageError')
            ])
        ])

    args = dict(
        examples=examples,
        # Change threshold will be ignored if there is no baseline (first run).
        eval_config=eval_config
    )

    if model:
        args.update(model=model)
    if baseline_model:
        args.update(baseline_model=baseline_model)

    return tfx.components.Evaluator(**args).with_id('Evaluator')


def pusher(
    model: types.Channel,
    model_blessing: Optional[types.Channel] = None
) -> tfx.components.Pusher:
    args = dict(
        model=model,
        custom_executor_spec=executor_spec.ExecutorClassSpec(ai_platform_pusher_executor.Executor),
        custom_config={
            ai_platform_pusher_executor.SERVING_ARGS_KEY: configs.GCP_AI_PLATFORM_SERVING_ARGS
        }
    )
    if model_blessing:
        args.update(model_blessing=model_blessing)

    return tfx.components.Pusher(**args).with_id("Pusher")


def pusher_vertex(
    model: types.Channel,
    model_blessing: Optional[types.Channel] = None
):
    args = dict(
        model=model,
        custom_executor_spec=executor_spec.ExecutorClassSpec(ai_platform_pusher_executor.Executor),
        custom_config={
            ENABLE_VERTEX_KEY: True,
            VERTEX_REGION_KEY: configs.GOOGLE_CLOUD_REGION,
            VERTEX_CONTAINER_IMAGE_URI_KEY: 'us-docker.pkg.dev/vertex-ai/prediction/tf2-cpu.2-5:latest',
            # See here https://cloud.google.com/vertex-ai/docs/predictions/pre-built-containers
            ai_platform_pusher_executor.SERVING_ARGS_KEY: configs.GCP_AI_PLATFORM_SERVING_ARGS
        }
    )
    if model_blessing:
        args.update(model_blessing=model_blessing)

    return tfx.components.Pusher(**args).with_id("PusherVertexAI")


def tuner(
    examples: types.Channel,
    schema: Optional[types.Channel] = None,
    transform_graph: Optional[types.Channel] = None,
    base_model: Optional[types.Channel] = None,
):
    args = dict(
        module_file=configs.MODULE_FILE,
        examples=examples,
        train_args=trainer_pb2.TrainArgs(num_steps=configs.TRAIN_NUM_STEPS),
        eval_args=trainer_pb2.EvalArgs(num_steps=configs.EVAL_NUM_STEPS),
        tune_args=tuner_pb2.TuneArgs(num_parallel_trials=configs.TUNE_NUM_PARALLEL_TRIALS),
        custom_config={
            # configures Cloud AI Platform-specific configs. For details, see
            # https://cloud.google.com/ai-platform/training/docs/reference/rest/v1/projects.jobs#traininginput.
            TUNING_ARGS_KEY: configs.GCP_AI_PLATFORM_TUNING_ARGS
        }
    )

    if schema:
        args.update(schema=schema)
    if transform_graph:
        args.update(transform_graph=transform_graph)
    if base_model:
        args.update(base_model=base_model)

    return tfx.extensions.google_cloud_ai_platform.Tuner(**args).with_id("HyperparametersTuner")


@component
def pubsub(
    topic: str,
    data = None
):
    # My simple custom pubsub  component.
    try:
        print(f"Publishing to PubSub topic {topic}: {data}")
        publicher = pubsub.PublisherClient()
        topic = publicher.topic_path(configs.GOOGLE_CLOUD_PROJECT, topic)
        data = data if type(data) is str else json.dumps(data)
        publicher.publish(topic, data.encode('utf-8'))
    except Exception as e:
        print(f"pubsub_send error: {e}")

    return {}
