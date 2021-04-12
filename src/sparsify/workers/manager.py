# Copyright (c) 2021 - present / Neuralmagic, Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Code related to managing jobs in the server
"""

import logging
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from typing import Any, Dict, Generic, TypeVar

from sparseml.utils import Singleton
from sparsify.models import Job, JobStatus, database
from sparsify.workers.base import JobWorker, JobWorkerRegistry


__all__ = ["JobNotFoundError", "JobCancelationFailureError", "JobWorkerManager"]


_LOGGER = logging.getLogger(__name__)


class JobNotFoundError(Exception):
    """
    Error raised if a job is not found in the database
    """

    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class JobCancelationFailureError(Exception):
    """
    Error raised if a job could not be canceled
    """

    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class JobCancelError(Exception):
    """
    Error raised if a job was canceled
    """

    def __init__(self, *args: object):
        super().__init__(*args)


_T = TypeVar("_T")


class _LockedVar(Generic[_T]):
    def __init__(self, initial: _T):
        self._lock = threading.Lock()
        self._value = initial

    def get(self) -> _T:
        with self._lock:
            return self._value

    def set(self, value: _T):
        with self._lock:
            self._value = value


class _JobExecutionState(object):
    def __init__(self):
        self._db_canceled_check_time = None
        self._db_progress_saved_time = None

    @property
    def db_canceled_check_time(self) -> float:
        return self._db_canceled_check_time

    @db_canceled_check_time.setter
    def db_canceled_check_time(self, value: float):
        self._db_canceled_check_time = value

    @property
    def db_progress_saved_time(self) -> float:
        return self._db_progress_saved_time

    @db_progress_saved_time.setter
    def db_progress_saved_time(self, value: float):
        self._db_progress_saved_time = value


class JobWorkerManager(object, metaclass=Singleton):
    """
    Manager class for handling running job workers in the background.
    Only one job worker can run at once.
    Once one completes, the next oldest one marked as pending in the db is launched.

    :param max_workers: The maximum number of workers to allow the ThreadPoolExecutor
        to work with in parallel
    """

    def __init__(self, max_workers: int = 1):
        self._pool = ThreadPoolExecutor(max_workers=max_workers)
        self._canceled = _LockedVar(False)
        self._refresh_lock = threading.Lock()

    def start(self):
        """
        Start the JobWorkerManager to begin processing any background jobs present
        """
        _LOGGER.info("Starting JobWorkerManager")
        self._cancel_pending_jobs()
        self.refresh()

    def shutdown(self):
        """
        Shutdown the JobWorkerManager to stop processing any background jobs
        """
        _LOGGER.info("Canceling JobWorkerManager")
        self._canceled.set(True)
        self._pool.shutdown()
        _LOGGER.info("Canceled JobWorkerManager")

    @database.connection_context()
    def refresh(self):
        """
        Refresh the available jobs and put any pending ones since last refresh
        onto the ThreadPoolExecutor.

        Otherwise will exit out without doing anything and
        subsequent jobs will be launched after the current one completes.
        """
        # lock to make sure the queries are safe across threads and jobs are unique
        # should be done with a DB transaction, but current setup with
        # peewee and the connection pooling does not support transactions
        with self._refresh_lock:
            _LOGGER.info("Refreshing JobWorkerManager")
            query = (
                Job.select()
                .where(
                    Job.status == JobStatus.pending
                    and Job.worker_ack == False  # noqa: E712
                )  # noqa: E712
                .order_by(Job.created)
            )
            job_ids = [job.job_id for job in query]
            _LOGGER.info(f"Found {len(job_ids)} pending jobs, adding to threadpool")

            for job in query:
                _LOGGER.debug(f"Adding job {job.job_id} to threadpool")
                self._pool.submit(self._execute_job, str(job.job_id), self._canceled)

            _LOGGER.debug("Updating jobs in db to ack that worker received them")
            Job.update(worker_ack=True).where(Job.job_id.in_(job_ids)).execute()

    @database.connection_context()
    def cancel_job(self, job_id: str):
        """
        Cancel a job with the given job_id so it won't be run.

        :param job_id: the job_id to cancel
        :raise JobNotFoundError: if the job could not be found in the database
        :raise JobCancelationFailureError: if the job could not be canceled
        """
        _LOGGER.info("Canceling job {}".format(job_id))

        try:
            _LOGGER.debug(f"Getting job {job_id} from DB")
            job = Job.get_or_none(Job.job_id == job_id)

            if job is None:
                _LOGGER.error(f"Could not find job {job_id} to cancel")
                raise JobNotFoundError()

            if (
                job.status == JobStatus.error
                or job.status == JobStatus.completed
                or job.status == JobStatus.canceled
            ):
                _LOGGER.error(f"Could not cancel job {job_id} with status {job.status}")

                raise JobCancelationFailureError(
                    "Job with status {} cannot be canceled".format(job.status)
                )

            self._update_job_canceled(job)
        except (JobNotFoundError, JobCancelationFailureError) as passthrough_err:
            raise passthrough_err
        except Exception as err:
            _LOGGER.warning(f"Error while canceling job {job_id} in db: {err}")

    @database.connection_context()
    def _cancel_pending_jobs(self):
        _LOGGER.debug("Canceling any pending jobs")
        query = Job.update(
            status=JobStatus.canceled,
            error=(
                "Job was left in a stranded state and did not complete on last run, "
                "canceled on server startup"
            ),
        ).where(Job.status == JobStatus.started or Job.status == JobStatus.pending)
        row_count = query.execute()

        if row_count > 0:
            _LOGGER.info(f"Canceled {row_count} stranded jobs")

    @database.connection_context()
    def _execute_job(self, job_id: str, canceled: _LockedVar[bool]):
        _LOGGER.info(f"Starting job {job_id} in JobWorkerManager")
        state = _JobExecutionState()
        job = None

        try:
            _LOGGER.debug(f"Getting job {job_id} from DB")
            job = Job.get(Job.job_id == job_id)

            if self._check_cancel_job(job, canceled, state):
                _LOGGER.debug(
                    f"Job {job_id} cancel requested before starting, canceling"
                )
                raise JobCancelError()

            self._update_job_started(job)

            _LOGGER.debug(f"Creating worker for job {job_id}")
            worker = JobWorkerRegistry.create_worker(job)  # type: JobWorker

            _LOGGER.debug(f"Starting worker run for job {job_id}")
            for progress in worker.run():
                if self._check_cancel_job(job, canceled, state):
                    _LOGGER.debug(f"Job {job_id} cancel requested, canceling")
                    raise JobCancelError()

                self._update_job_progress(job, state, progress)

            self._update_job_completed(job)
        except JobCancelError:
            if not job:
                raise RuntimeError("job is None after JobCancelError")

            self._update_job_canceled(job)
            _LOGGER.info(f"Job {job_id} canceled in JobWorkerManager")
        except Exception as err:
            # try to update the job in the DB in case the job doesn't exist
            # or the job was deleted from the DB
            try:
                self._update_job_error(job, err)
            except Exception as save_err:
                _LOGGER.warning(
                    f"Could not update job state in db to errored "
                    f"for job {job_id}: {save_err}: for error {err}"
                )

    def _check_cancel_job(
        self, job: Job, canceled: _LockedVar[bool], state: _JobExecutionState
    ) -> bool:
        # cancel if overall system is being shutdown
        if canceled.get() or not threading.main_thread().is_alive():
            return True

        # refresh job state at maximum one second intervals to see if job was canceled
        if (
            state.db_canceled_check_time
            and time.time() - state.db_canceled_check_time < 1.0
        ):
            return False

        job = job.refresh()
        state.db_canceled_check_time = time.time()

        return job.status == JobStatus.canceled

    def _update_job_started(self, job: Job):
        _LOGGER.debug(f"Updating job {job.job_id} to started status")
        job.status = JobStatus.started
        job.save()

    def _update_job_progress(self, job: Job, state: _JobExecutionState, progress: Dict):
        # update the progress max 5 times a second to not hammer the DB
        if (
            state.db_progress_saved_time
            and time.time() - state.db_progress_saved_time < 0.2
        ):
            return

        _LOGGER.debug(f"Job {job.job_id} saving progress to DB")
        job.progress = progress
        job.save()
        state.db_progress_saved_time = time.time()

    def _update_job_completed(self, job: Job):
        _LOGGER.debug(f"Job {job.job_id} completed, saving DB state")
        job.status = JobStatus.completed
        job.progress = None
        job.save()
        _LOGGER.info(f"Job {job.job_id} completed in JobWorkerManager")

    def _update_job_canceled(self, job: Job):
        _LOGGER.debug(f"Job {job.job_id} cancel requested, saving in DB")
        job.status = JobStatus.canceled
        job.progress = None
        job.save()
        _LOGGER.info(f"Job {job.job_id} canceled in DB")

    def _update_job_error(self, job: Job, err: Any):
        _LOGGER.debug(f"Job {job.job_id} errored, saving to DB")
        job.status = JobStatus.canceled
        job.error = err
        job.progress = None
        job.save()
        _LOGGER.warning(f"Job {job.job_id} errored out {err}")
