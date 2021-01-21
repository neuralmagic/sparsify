# Integrate

After you optimize your model, click the **EXPORT** button on the Optimization screen to initiate the integration process.

<kbd><img src="images/image_59.jpg" alt="(Export button circled)" width="480" height="270" /></kbd>

During integration, you will generate a configuration (yml) file and integrate code into your training. This minimizes the work needed for you to train. The configuration file includes descriptions ("modifiers") of how the model will be modified during training. These modifiers correspond to modifiers in the [SparseML code base](github.com/neuralmagic/sparseml/). You can integrate the configuration file with your existing training platform and do not need to rewrite any part of your platform for optimization.

<kbd><img src="images/image_60.jpg" alt="(Configuration file)" width="320" height="300" /></kbd>

Your goals are to:

- Export the configuration file.

- Include Sparsify-generated integration and/or training code into your current training flow.

You can choose the PyTorch or TensorFlow framework, and the file code will change accordingly.

---
**Next step...**

Explore the [Optimization Config File and Code for Optimization](06a-optimize-config.md).
