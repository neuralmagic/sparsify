# Sparsify Create

Sparsify Create is a tool to automatically generate sparsification recipes and apply them to
custom training aware scenarios.

This document outlines basic usage of `sparsify.create`. For a full list of arguments, check the docstring.


## Usage
The main entrypoint of `sparsify.create` is the `initialize` function. `initialize` takes a pytorch
model, optimizer, and number of steps in each epoch, creates a sparsification recipe, and wraps the
training script to incorporate sparsification in the existing training process.

`sparsify.create.initialize` should be called **after** the model, optimizer, and dataloader
(for determining number of steps per epoch) have been created but **before** the training process starts.


```python
import sparsify

# EXISTING TRAINING VARIABLES
MODEL = ...
OPTIMIZER = ...
STEPS_PER_EPOCH = ...  # len(DATALOADER)

# initialize sparsify.create
sparsification_manager, OPTIMIZER = sparsify.create.initialize(
    MODEL, OPTIMIZER, STEPS_PER_EPOCH
)

# if the script has an end epoch, update it from the manager
END_EPOCH = sparsification_manager.max_epochs
```


## Recipe Variables
The `recipe_variables` argument may be used to override particular values related to the sparsification
recipe. This may include, epochs, pruning type, target hardware, and distillation hyper parameters.

`recipe_variables` must be specified as a `RecipeVariables` schema or dictionary containing the valid
variables. `RecipeVariables` schema and help text is included in `schemas.py`.


## Additional Integration Notes
This section contains notes on additional updates that are useful for best practice with `sparsify.create`.

### Max Epochs
As noted above, once sparsificaiton starts, it sets a new internal max epoch. To account for this
any end epoch that exists in the script should be updated according to the `sparsification_manager`:

```python
END_EPOCH = sparsification_manager.max_epochs
```

### Learning Rate Schedulers
`sparsify.create` creates a sparsification recipe that has its own learning rate scheduler. To avoid
learning rate conflicts, any existing learning rate schedulers should be disabled.  The kind of learning
rate scheudule used may be set with the `lr` parameter of `initialize()` and start and end LRs may
be set with `RecipeVariables`.

### Mixed Precision Training
If the integrated script supports mixed precision (FP16) training, it is likley using a torch `Scaler` object.
Since this is the object that will be used for `.step()` updates instead of the `optimizer` it should also
be passed to initialize and will instead be returned as an updated object:

```python
# extending the original example
SCALER = ...

# initialize sparsify.create and override the SCALER
sparsification_manager, SCALER = sparsify.create.initialize(
    MODEL, OPTIMIZER, STEPS_PER_EPOCH, scaler=SCALER
)
```

#### Quantization and Mixed Precision
PyTorch does not support FP16 training with quantization, thus when quantization begins, mixed precision should
be disabled. This can be done by setting `enabled=False` in the scaler and any context managers used in training
for autocast.

This will also cause an increase in GPU memory usage so the batch size should be adjusted to accommodate.

The epoch that quantization can starts can be found with the following snippet, if it exists, mixed precision
should be disabled after the `quantization_start_epoch`

```python
if sparsification_manager.quantization_modifiers:
    quantization_start_epoch = min(
        modifier.start_epoch
        for modifier in sparsification_manager.quantization_modifiers
    )
```

### Distillation
`sparsify.create` supports model distillation - to enable `distillation` should be set to `True`
in `initialize`.  Self distillation will be used by default, however a distillation teacher may
be passed to `initialize`.

Example of distillation with a custom teacher:
```python
# extending the original example
DISTILLATION_TEACHER = ...

# initialize sparsify.create and override the SCALER
sparsification_manager, OPTIMIZER = sparsify.create.initialize(
    MODEL,
    OPTIMIZER,
    STEPS_PER_EPOCH,
    distillation=True,
    distillation_teacher=DISTILLATION_TEACHER,
)
```


### Sparse Transfer Learning
Sparse transfer learning may be enabled by setting pruning to `transfer` in `initialize`:
```python
# extending the original example
sparsification_manager, OPTIMIZER = sparsify.create.initialize(
    MODEL, OPTIMIZER, STEPS_PER_EPOCH, pruning="constant"
)
```
