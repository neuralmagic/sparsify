# Sparsify Datasets Guide

For all Sparsify Experiments, you will need to provide a training dataset to fit to your sparse model you wish to create. You will need to make sure that your data is properly formatted to work with Sparsify. Depending on your use case, your data may need to take a specific form.  

To view how to properly format your data for use with Sparsify, view the Use Case Data Tutorials below (LINK) . Once your data is properly formatted, run the `sparsify.run` command and be sure to supply the argument `--data PATH_TO_DATA` with the path to your data in your local working directory. 

#### CV - classification: `cv-classification`  

Your data should be in the `COCO` format for cv-classification

**Example**   


#### CV - detection: `cv-detection`  

Your data should be in the [`COCO` format](https://cocodataset.org/#format-data)  for cv-detection use cases. 

**Example**   
```
To be filled in. 

# import dataset

# format dataset in proper coco format 

# save to local directory

# sparsify.run one-shot
--model ./yolov5.onnx \
--data ./coco_dataset \  
--use-case image-classification \  
--optim-level 0.50
```

REPEAT



-   CV - detection: `cv-detection`
-   CV - segmentation: `cv-segmentation`
-   NLP - question answering: `nlp-question_answering`
-   NLP - text classification: `nlp-text_classification`
-   NLP - sentiment analysis: `nlp-sentiment_analysis`
-   NLP - token classification: `nlp-token_classification`
-   NLP - named entity recognition: `nlp-named_entity_recognition`