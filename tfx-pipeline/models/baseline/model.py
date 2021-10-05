from typing import Dict, Text, List
import os
import numpy as np
import pandas as pd
import tensorflow as tf

import tensorflow_datasets as tfds
import tensorflow_recommenders as tfrs

from tfx import v1 as tfx
from tfx_bsl.public import tfxio
from tensorflow_metadata.proto.v0 import schema_pb2
from tensorflow_transform.tf_metadata import schema_utils


TRAIN_BATCH_SIZE = 128
EVAL_BATCH_SIZE = 128
EPOCHS = 10
TRAIN_NUM_STEPS = 100
EVAL_NUM_STEPS = 10

CATEGORICAL_FEATURE_KEYS = [
    'User_ID', 'Product_ID', 'Gender', 'Age', 'Occupation', 'City_Category', 'Stay_In_Current_City_Years',
    'Marital_Status', 'Product_Category_1', 'Product_Category_2', 'Product_Category_3', 'Purchase'
]

FEATURE_SPEC = {
#     **{
#         feature: tf.io.FixedLenFeature(shape=[1], dtype=tf.string)
#         for feature in CATEGORICAL_FEATURE_KEYS
#     },
    'User_ID': tf.io.FixedLenFeature(shape=[1], dtype=tf.int64), 
    'Product_ID': tf.io.FixedLenFeature(shape=[1], dtype=tf.string),
}


class UserProductModel(tfrs.Model):
    # We derive from a custom base class to help reduce boilerplate. Under the hood,
    # these are still plain Keras Models.

    def __init__(
            self,
            user_model: tf.keras.Model,
            product_model: tf.keras.Model,
            task: tfrs.tasks.Retrieval):
        super().__init__()

        # Set up user and movie representations.
        self.user_model = user_model
        self.product_model = product_model

        # Set up a retrieval task.
        self.task = task

    def compute_loss(self, features: Dict[Text, tf.Tensor], training=False) -> tf.Tensor:
        # Define how the loss is computed.

        user_embeddings = self.user_model(features["User_ID"])
        product_embeddings = self.product_model(features["Product_ID"])

        return self.task(user_embeddings, product_embeddings)


def _build_recommendation_system(users_data: tf.data.Dataset, products_data: tf.data.Dataset) -> tf.keras.Model:
    print("BUILD ML RECOMMENDATION SYSTEM")
    user_ids_vocabulary = tf.keras.layers.experimental.preprocessing.IntegerLookup(mask_token=None)
    user_ids_vocabulary.adapt(users_data)
    print("CREATE INPUT LAYER FOR USERS")

    product_ids_vocabulary = tf.keras.layers.experimental.preprocessing.StringLookup(mask_token=None)
    product_ids_vocabulary.adapt(products_data)
    print('!!!',products_data)
    print(next(products_data.as_numpy_iterator()))
    print(product_ids_vocabulary.vocabulary_size())
    print("CREATE INPUT LAYER FOR PRODUCTS")

    # Define user and product models.
    user_model = tf.keras.Sequential([
        user_ids_vocabulary,
        tf.keras.layers.Embedding(user_ids_vocabulary.vocabulary_size(), 64)
    ])
    print("DEFINE USER 'TOWER'")

    product_model = tf.keras.Sequential([
        product_ids_vocabulary,
        tf.keras.layers.Embedding(product_ids_vocabulary.vocabulary_size(), 64)
    ])
    print("DEFINE PRODUCT 'TOWER'")
    #print(product_model.summary())

    # Define your objectives.
    task = tfrs.tasks.Retrieval(
        metrics=tfrs.metrics.FactorizedTopK(products_data.map(product_model))
    )
    print("DEFINE RETRIEVAL TASK")

    # Create a retrieval model.
    model = UserProductModel(user_model, product_model, task)
    print("CREATE USER-PRODUCT RECOMMENDATION MODEL")
    return model


def reshape(features_dict: Dict[str, tf.Tensor]):
    return {k: tf.reshape(v, [-1]) for k,v in features_dict.items()}


def _input_fn(
        file_pattern: List[str],
        data_accessor: tfx.components.DataAccessor,
        schema: schema_pb2.Schema,
        batch_size: int) -> tf.data.Dataset:
    """Generates features and label for training.

    Args:
      file_pattern: List of paths or patterns of input tfrecord files.
      data_accessor: DataAccessor for converting input to RecordBatch.
      schema: schema of the input data.
      batch_size: representing the number of consecutive elements of returned
        dataset to combine in a single batch

    Returns:
      A dataset that contains (features, indices) tuple where features is a
        dictionary of Tensors, and indices is a single Tensor of label indices.
    """
    return data_accessor.tf_dataset_factory(
        file_pattern,
        tfxio.TensorFlowDatasetOptions(batch_size=batch_size),
        schema=schema
    ).map(reshape).repeat()


def _input_fn_lookup(
        file_pattern: List[str],
        data_accessor: tfx.components.DataAccessor,
        schema: schema_pb2.Schema,
        batch_size: int) -> tf.data.Dataset:

    return data_accessor.tf_dataset_factory(
        file_pattern,
        tfxio.TensorFlowDatasetOptions(batch_size=batch_size, num_epochs=1, shuffle=False),
        schema=schema
    ).map(reshape)


def get_schema():
    return schema_utils.schema_from_feature_spec(FEATURE_SPEC)


# TFX Trainer will call this function.
def run_fn(fn_args: tfx.components.FnArgs):
    """Train the model based on given args.

    Args:
    fn_args: Holds args used to train the model as name/value pairs.
    """
    print("ENTERING MODEL TRAINING SCRIPT")

    schema = get_schema()
    print("GET SCHEMA")

    lookup_dataset = _input_fn_lookup(fn_args.train_files, fn_args.data_accessor, schema, TRAIN_BATCH_SIZE)
    print("GET LOOKUP DATASET")
    train_dataset = _input_fn(fn_args.train_files, fn_args.data_accessor, schema, TRAIN_BATCH_SIZE)
    print("GET TRAIN DATASET")
    eval_dataset = _input_fn(fn_args.eval_files, fn_args.data_accessor, schema, EVAL_BATCH_SIZE)
    print("GET VALIDATION DATASET")

    mirrored_strategy = tf.distribute.MirroredStrategy()
    with mirrored_strategy.scope():
        users = lookup_dataset.map(lambda x: x['User_ID']).unique()
        print("EXTRACT USERS DATA FROM TRAIN DATASET")
        products = lookup_dataset.map(lambda x: x['Product_ID']).unique()
        print("EXTRACT PRODUCT DATA FROM TRAINING DATASET")
        purchases = lookup_dataset.map(lambda x: {
            "User_ID": x['User_ID'],
            "Product_ID": x['Product_ID']
        })
        print("EXTRACT PURCHASE DATA FROM TRAINING DATASET")

        model = _build_recommendation_system(users, products)
        print("BUILD MODEL")
        model.compile(optimizer=tf.keras.optimizers.Adagrad(0.5))
        print("COMPILE MODEL")
        
    # model.summary()

    # tb_logdir = os.path.join(
    #     fn_args.model_run_dir[:fn_args.model_run_dir.rfind('/')],
    #     f"baseline-({fn_args.model_run_dir[fn_args.model_run_dir.rfind('/') + 1:]})"
    # )
    tensorboard_callback = tf.keras.callbacks.TensorBoard(
        # log_dir=tb_logdir,
        update_freq=10,
        histogram_freq=1,
        embeddings_freq=1,
    )

    model.fit(
        train_dataset,
        epochs=EPOCHS,
        steps_per_epoch=TRAIN_NUM_STEPS,
        validation_data=eval_dataset,
        validation_steps=EVAL_NUM_STEPS,
        callbacks=[
            # earlystopping_callback,
            # tensorboard_callback,
        ]
    )
    print(f"TRAIN MODEL FOR {EPOCHS} EPOCHS")
    
    index = tfrs.layers.factorized_top_k.BruteForce(model.user_model)
    index.index_from_dataset(
        products.map(lambda title: (title, model.product_model(title))))
    #print(index.summary())

    #index.save(fn_args.serving_model_dir, save_format='tf')
    
    tf.saved_model.save(
        index,
        fn_args.serving_model_dir,
        # options=tf.saved_model.SaveOptions(namespace_whitelist=["Scann"])
    )
