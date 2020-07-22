# Neural Magic Studio
## Setting Up UI for Server
1) Move contents of `public/built/` to `server/static`

## Running tests
1) Start the server with the following command `python3 neuralmagic_studio server --project-root  /tmp/recal.neuralmagic.com/test_data/`
2) Run `pytest tests`

## API
### Get All Projects
Obtain a list of projects objects found under the project folder.

- #### URL
    /api/projects 
- #### Method
    GET
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "projects": [
            {
                "projectId": "7bb1c15a-3386-4a12-8e36-37e9691bea6f",
                "projectName": "test project"
            },
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Path {project_root} does not exist"}
    ```

### Create Project
Create a new project using an onnx model and with provided project settings.

- #### URL
    /api/projects 
- #### Method
    POST
- #### Data Params
    ##### Required:
    - modelPath <i>string</i> <br> Path to the onnx model
    - projectConfig <i>dict</i> <br> Dict mapping various project settings
- #### Success Response
    - Code: 200
    - Content:
    ```
    {
        "projectId": "7bb1c15a-3386-4a12-8e36-37e9691bea6f",
        "projectName": "test project"
    }
    ```
- ##### Error Response
    - Code: 404
    - Content:
    ```
    {
        "message": "Path ~/Downloads/model.onnx does not exist"
    }
    ```
    OR
    - Code: 400
    - Content:
    ```
    {
        "message": "Path ~/Downloads/model.onnx is not a valid file"
    }
    ```

### Get Project
Get a project object
- #### URL
    /api/projects/:project_id:
- #### Method
    GET
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "project": {
            "projectId": "7bb1c15a-3386-4a12-8e36-37e9691bea6f",
            "projectName": "test project"
        },
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Edit Project
Edit a project's config settings
- #### URL
    /api/projects/:project_id:
- #### Method
    PUT
- #### Data Params
    ##### Required:
    - projectConfig <i>dict</i> <br> Dict mapping various project settings
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "project": {
            "projectId": "7bb1c15a-3386-4a12-8e36-37e9691bea6f",
            "projectName": "test project new name"
        },
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Get Prunable Layers
Get all layers in model that are prunable
- #### URL
    /api/projects/:project_id:/prunable-layers
- #### Method
    GET
- #### Success Response:
    - Code: 200
    - Content:
    ```
    {
    "prunableLayers": [
        {
            "attributes": {
                "dilations": [
                    1,
                    1
                ],
                "group": 1,
                "kernel_shape": [
                    7,
                    7
                ],
                "pads": [
                    3,
                    3,
                    3,
                    3
                ],
                "strides": [
                    2,
                    2
                ]
            },
            "id": "LAYER_ID",
            "inputs": [
                "input",
                "input.conv.weight"
            ],
            "name": "input.conv.weight",
            "op_type": "Conv",
            "output": [
                "123"
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Get Approximate Loss Sensitivity Analysis
Uses the magnitude of the layer's weight to approximate the loss sensitivity
- #### URL
    /api/projects/:project_id:/sparse-analysis/loss/approx
- #### Method
    GET
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
        {
            "baseline": {
                "loss": 0.0,
                "sparsity": 0.0
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "loss": 5.665469759996711e-10,
                    "sparsity": 0.09566326530612244
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Get Loss Sensitivity Analysis
Gets a loss analysis saved in project
- #### URL
    /api/projects/:project_id:/sparse-analysis/loss/:analysis_id:
- #### Method
    GET
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
        {
            "baseline": {
                "loss": 0.0,
                "sparsity": 0.0
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "loss": 5.665469759996711e-10,
                    "sparsity": 0.09566326530612244
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Run Loss Sensitivity Analysis
Runs one shot loss sensitivity analysis and saves results to provided file
- #### URL
    /api/projects/:project_id:/sparse-analysis/loss/:analysis_id:
- #### Method
    POST
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
        {
            "baseline": {
                "loss": 0.0,
                "sparsity": 0.0
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "loss": 5.665469759996711e-10,
                    "sparsity": 0.09566326530612244
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Edits Loss Sensitivity Analysis
Saves a loss analysis to project
- #### URL
    /api/projects/:project_id:/sparse-analysis/loss/:analysis_id:
- #### Method
    PUT
- ### Data Params
    ##### Required:
    - loss <i>dict</i> <br> List of loss analysis by layer
    ```
    {
        "loss": [
        {
            "baseline": {
                "loss": 0.0,
                "sparsity": 0.0
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "loss": 5.665469759996711e-10,
                    "sparsity": 0.09566326530612244
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
        {
            "baseline": {
                "loss": 0.0,
                "sparsity": 0.0
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "loss": 5.665469759996711e-10,
                    "sparsity": 0.09566326530612244
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Get Approximate Perf Sensitivity Analysis
Uses approximate flops to create the perf sensitivity analysis
- #### URL
    /api/projects/:project_id:/sparse-analysis/perf/approx
- #### Method
    GET
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
        {
            {
                "baseline": {
                "flops": 118013952.0,
                "timings": null
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "flops": 117901056.0,
                    "sparsity": 0.09566326530612244,
                    "timings": null
                },..
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Get Perf Sensitivity Analysis
Gets a perf analysis saved in project
- #### URL
    /api/projects/:project_id:/sparse-analysis/perf/:analysis_id:
- #### Method
    GET
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
        {
            "baseline": {
                "flops": 236027904,
                "sparsity": 0.0,
                "timing": 0.34226666666666666
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "flops": 236027904,
                    "sparsity": 0.4,
                    "timing": 0.3799
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Run Perf Sensitivity Analysis
Runs benchmarking to create perf sensitivity analysis and saves results to provided file
- #### URL
    /api/projects/:project_id:/sparse-analysis/perf/:analysis_id:
- #### Method
    POST
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
        {
            "baseline": {
                "flops": 236027904,
                "sparsity": 0.0,
                "timing": 0.34226666666666666
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "flops": 236027904,
                    "sparsity": 0.4,
                    "timing": 0.3799
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```

### Edits Perf Sensitivity Analysis
Saves a perf analysis to project
- #### URL
    /api/projects/:project_id:/sparse-analysis/perf/:analysis_id:
- #### Method
    PUT
- ### Data Params
    ##### Required:
    - perf <i>dict</i> <br> List of perf analysis by layer
    ```
    {
        "loss": [
        {
            "baseline": {
                "flops": 236027904,
                "sparsity": 0.0,
                "timing": 0.34226666666666666
            },
            "id": "LAYER_ID",
            "sparse": [
                {
                    "flops": 236027904,
                    "sparsity": 0.4,
                    "timing": 0.3799
                },
                ...
            ]
        },
        ...
        ]
    }
    ```
- #### Success Response
    - Code: 200
    - Content: 
    ```
    {
        "layerSensitivities": [
            {
                "baseline": {
                    "flops": 236027904,
                    "sparsity": 0.0,
                    "timing": 0.34226666666666666
                },
                "id": "LAYER_ID",
                "sparse": [
                    {
                        "flops": 236027904,
                        "sparsity": 0.4,
                        "timing": 0.3799
                    },
                    ...
                ]
            },
            ...
          ]
    }
    ```
- #### Error Resposne
    - Code: 404
    - Content: 
    ```
    {"message": "Project 7bb1c15a-3386-4a12-8e36-37e9691bea6f does not exist"}
    ```