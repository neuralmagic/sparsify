# Sparsify Use Cases Guide

To use Sparsify, you must designate a use case and provide a dataset that you wish to get a sparse ONNX model for. You are required to designate both the use-case as well as provide a training dataset that will be applied for the Sparse-Transfer and Training-Aware Experiments. For the One-Shot Experiment, you will additionally need to provide a dense model you wish to optimize for inference.
   
   **Use Cases**  
   You can select from the following lists of supported list of use-cases (--use-case) to create a performant model for: 
- CV - classification: `cv-classification`
- CV - detection: `cv-detection`
- CV - segmentation: `cv-segmentation`
- NLP - question answering: `nlp-question_answering`
- NLP - text classification: `nlp-text_classification`
- NLP - sentiment analysis: `nlp-sentiment_analysis`
- NLP - token classification: `nlp-token_classification`
- NLP - named entity recognition: `nlp-named_entity_recognition`
