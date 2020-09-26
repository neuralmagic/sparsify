import {
  createSlice,
  createAsyncThunk,
  AsyncThunk,
  Slice,
  createSelector,
} from "@reduxjs/toolkit";

import {
  jobProgressValue,
  requestCreateProject,
  requestCreateProjectModelAnalysis,
  requestGetJobTerminal,
  requestGetProject,
  requestUploadProjectModel,
  requestUploadProjectModelFromPath,
} from "../api";
import { STATUS_FAILED, STATUS_IDLE, STATUS_LOADING, STATUS_SUCCEEDED } from "./utils";

const createProjectWithModelUploadType =
  "createProject/createProjectWithModelUploadThunk";
const createProjectWithModelUploadProgressType = `${createProjectWithModelUploadType}/progress`;
const createProjectWithModelUploadProgressAction = (stage, progress, project) => {
  return {
    type: createProjectWithModelUploadProgressType,
    payload: {
      stage,
      progress,
      project,
    },
  };
};

/**
 * Async thunk for create a new project, uploading the desired model to it,
 * and then running a model analysis on it
 *
 * @type {AsyncThunk<Promise<*>, {readonly file?: *}, {}>}
 */
export const createProjectWithModelUploadThunk = createAsyncThunk(
  createProjectWithModelUploadType,
  async ({ file }, thunkAPI) => {
    // first create a project to upload the model to
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction("projectCreate", null, null)
    );
    const projectName = file.name ? file.name.replace(/\.[^/.]+$/, "") : "";
    const createBody = await requestCreateProject(projectName);
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction(
        "projectCreate",
        null,
        createBody.project
      )
    );

    // next upload the model to the created project
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction("modelUpload", 0, createBody.project)
    );
    const uploadBody = await requestUploadProjectModel(
      createBody.project.project_id,
      file,
      (progress) => {
        const { loaded, total } = progress;
        const progressVal = (loaded / total) * 100;
        thunkAPI.dispatch(
          createProjectWithModelUploadProgressAction(
            "modelUpload",
            progressVal,
            createBody.project
          )
        );
      }
    );

    // next create a model analysis for the uploaded model
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction(
        "modelAnalysis",
        null,
        createBody.project
      )
    );
    const analysisBody = await requestCreateProjectModelAnalysis(
      createBody.project.project_id
    );

    // finally get the latest state for the project and return it
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction("finalize", null, createBody.project)
    );
    const projectBody = await requestGetProject(createBody.project.project_id);

    return projectBody.project;
  }
);

export const createProjectWithModelFromPathThunk = createAsyncThunk(
  createProjectWithModelUploadType,
  async ({ uri }, thunkAPI) => {
    // first create a project to upload the model to
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction("projectCreate", null, null)
    );
    const createBody = await requestCreateProject("");
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction(
        "projectCreate",
        null,
        createBody.project
      )
    );

    // next push the model to the created project to begin its job
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction("modelDownload", 0, createBody.project)
    );
    const uploadBody = await requestUploadProjectModelFromPath(
      createBody.project.project_id,
      uri
    );

    // next query the job status for completion or error
    const jobBody = await requestGetJobTerminal(
      uploadBody.model.job.job_id,
      (progress) => {
        thunkAPI.dispatch(
          createProjectWithModelUploadProgressAction(
            "modelDownload",
            jobProgressValue(progress),
            createBody.project
          )
        );
      },
      () => false
    );

    // next create a model analysis for the uploaded model
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction(
        "modelAnalysis",
        null,
        createBody.project
      )
    );
    const analysisBody = await requestCreateProjectModelAnalysis(
      createBody.project.project_id
    );

    // finally get the latest state for the project and return it
    thunkAPI.dispatch(
      createProjectWithModelUploadProgressAction("finalize", null, createBody.project)
    );
    const projectBody = await requestGetProject(createBody.project.project_id);

    return projectBody.project;
  }
);

export const createProjectProfilesThunk = createAsyncThunk(
  "createProject/createProjectProfilesThunk",
  async (
    {
      profileLoss,
      profilePerf,
      profileLossName,
      profilePerfName,
      profilePerfBatchSize,
      profilePerfNumCores,
    },
    thunkAPI
  ) => {}
);

const defaultCreateProjectState = {
  // state for modal
  slideIndex: 2,
  modelSelectRecognized: false,
  remotePath: "",
  remotePathError: "",
  selectedFile: null,
  profileLoss: true,
  profilePerf: true,
  profilePerfName: "baseline",
  profileLossName: "baseline",
  profilePerfBatchSize: "1",
  profilePerfNumCores: null,

  // state for creation
  val: null,
  creationStatus: STATUS_IDLE,
  creationError: null,
  creationProgressStage: null,
  creationProgressValue: null,

  // state for profiling
  profilingLossVal: null,
  profilingPerfVal: null,
  profilingStatus: STATUS_IDLE,
  profilingError: null,
  profilingProgressStage: null,
  profilingProgressValue: null,
};

const createProjectSlice = createSlice({
  name: "createProject",
  initialState: { ...defaultCreateProjectState },
  reducers: {
    clearCreateProject: (state, action) => {
      Object.keys(defaultCreateProjectState).forEach((key) => {
        state[key] = defaultCreateProjectState[key];
      });
    },
    updateCreateProjectModal: (state, action) => {
      Object.keys(action.payload).forEach((key) => {
        state[key] = action.payload[key];
      });
    },
  },
  extraReducers: {
    [createProjectWithModelUploadThunk.pending]: (state, action) => {
      state.creationStatus = STATUS_LOADING;
      state.creationError = null;
      state.val = null;
      state.creationProgressStage = null;
      state.creationProgressValue = null;
    },
    [createProjectWithModelUploadThunk.fulfilled]: (state, action) => {
      state.creationStatus = STATUS_SUCCEEDED;
      state.creationError = null;
      state.val = action.payload;
      state.creationProgressStage = null;
      state.creationProgressValue = null;
    },
    [createProjectWithModelUploadThunk.rejected]: (state, action) => {
      state.creationStatus = STATUS_FAILED;
      state.creationError = action.error.message;
      state.creationProgressStage = null;
      state.creationProgressValue = null;
    },
    [createProjectWithModelUploadProgressType]: (state, action) => {
      state.creationStatus = STATUS_LOADING;
      state.creationError = null;

      if (action.payload.project) {
        state.val = action.payload.project;
      }

      state.creationProgressStage = action.payload.stage;
      state.creationProgressValue = action.payload.progress;
    },
  },
});

/***
 * Available actions for createProject redux store
 */
export const {
  clearCreateProject,
  updateCreateProjectModal,
} = createProjectSlice.actions;

export const selectCreateProjectState = (state) => state.createProject;

export default createProjectSlice.reducer;
