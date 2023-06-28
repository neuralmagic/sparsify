# Sparsify Optim (Sparsification) Levels Guide

When using Sparsify, you will have the ability to set a model optimization level. This optimization level is a value between 0.0 and 1.0 where 0.0 is fully optimized for accuracy and 1.0 is fully optimized for performance. Note that if you fully optimize for one extreme that does not mean that there will be no sparsity present or accuracy will be completely ignored. It just means that Sparsify will optimize your model to that metric as much as possible, while maintaining a reasonable accuracy or performance value. 
