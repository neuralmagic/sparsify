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
Server routes related to the jobs routes
"""

import logging
from http import HTTPStatus

from flasgger import swag_from
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from sparsify.blueprints.utils import API_ROOT_PATH, HTTPNotFoundError
from sparsify.models import Job
from sparsify.schemas import (
    ErrorSchema,
    ResponseJobSchema,
    ResponseJobsSchema,
    SearchJobsSchema,
)
from sparsify.workers import (
    JobCancelationFailureError,
    JobNotFoundError,
    JobWorkerManager,
)


__all__ = ["JOBS_PATH", "jobs_blueprint"]


JOBS_PATH = "{}/jobs".format(API_ROOT_PATH)

_LOGGER = logging.getLogger(__name__)

jobs_blueprint = Blueprint(JOBS_PATH, __name__, url_prefix=JOBS_PATH)


@jobs_blueprint.route("/")
@swag_from(
    {
        "tags": ["Jobs"],
        "summary": "Get the list of jobs that have ended, running, or pending to run",
        "produces": ["application/json"],
        "parameters": [
            {
                "in": "query",
                "name": "project_id",
                "type": "string",
                "description": "The project_id to get a list of jobs for, "
                "if not supplied then will get jobs for all project",
            },
            {
                "in": "query",
                "name": "order_by",
                "type": "string",
                "enum": ["created", "modified", "status"],
                "description": "The field to order the jobs by in the response. "
                "Default created",
            },
            {
                "in": "query",
                "name": "order_desc",
                "type": "boolean",
                "description": "True to order the jobs in descending order, "
                "False otherwise. Default True",
            },
            {
                "in": "query",
                "name": "page",
                "type": "integer",
                "description": "The page (one indexed) to get of the jobs. "
                "Default 1",
            },
            {
                "in": "query",
                "name": "page_length",
                "type": "integer",
                "description": "The length of the page to get (number of jobs). "
                "Default 20",
            },
        ],
        "responses": {
            HTTPStatus.OK.value: {
                "description": "The requested jobs",
                "schema": ResponseJobsSchema,
            },
            HTTPStatus.BAD_REQUEST.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
            HTTPStatus.INTERNAL_SERVER_ERROR.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
        },
    },
)
def get_jobs():
    """
    Route for getting a list of jobs filtered by the flask request args

    :return: a tuple containing (json response, http status code)
    """
    _LOGGER.info("getting jobs for request args {}".format(request.args))
    args = SearchJobsSchema().load({key: val for key, val in request.args.items()})

    query = Job.select()
    if "project_id" in args and args["project_id"]:
        query = query.where(Job.project == args["project_id"])
    order_by = getattr(Job, args["order_by"])
    query = query.order_by(
        order_by if not args["order_desc"] else order_by.desc()
    ).paginate(args["page"], args["page_length"])

    jobs = [res for res in query]
    resp_schema = ResponseJobsSchema()
    resp_jobs = resp_schema.dump({"jobs": jobs})
    resp_schema.validate(resp_jobs)
    _LOGGER.info("retrieved {} jobs".format(len(resp_jobs)))

    return jsonify(resp_jobs), HTTPStatus.OK.value


@jobs_blueprint.route("/<job_id>")
@swag_from(
    {
        "tags": ["Jobs"],
        "summary": "Get a job",
        "produces": ["application/json"],
        "parameters": [
            {
                "in": "path",
                "name": "job_id",
                "description": "ID of the job to return",
                "required": True,
                "type": "string",
            },
        ],
        "responses": {
            HTTPStatus.OK.value: {
                "description": "The matching job",
                "schema": ResponseJobSchema,
            },
            HTTPStatus.BAD_REQUEST.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
            HTTPStatus.NOT_FOUND.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
            HTTPStatus.INTERNAL_SERVER_ERROR.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
        },
    },
)
def get_job(job_id: str):
    """
    Route for getting a job matching the given job_id.
    Raises an HTTPNotFoundError if the job is not found in the database.

    :param job_id: the id of the job to get
    :return: a tuple containing (json response, http status code)
    """
    _LOGGER.info("getting job {}".format(job_id))
    job = Job.get_or_none(Job.job_id == job_id)

    if job is None:
        raise HTTPNotFoundError("could not find job with job_id {}".format(job_id))

    resp_schema = ResponseJobSchema()
    resp_job = resp_schema.dump({"job": job})
    resp_schema.validate(resp_job)
    _LOGGER.info("retrieved job {}".format(resp_job))

    return jsonify(resp_job), HTTPStatus.OK.value


@jobs_blueprint.route("/<job_id>/cancel", methods=["POST"])
@swag_from(
    {
        "tags": ["Jobs"],
        "summary": "Cancel a job",
        "produces": ["application/json"],
        "parameters": [
            {
                "in": "path",
                "name": "job_id",
                "description": "ID of the job to return",
                "required": True,
                "type": "string",
            },
        ],
        "responses": {
            HTTPStatus.OK.value: {
                "description": "The canceled job details",
                "schema": ResponseJobSchema,
            },
            HTTPStatus.BAD_REQUEST.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
            HTTPStatus.NOT_FOUND.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
            HTTPStatus.INTERNAL_SERVER_ERROR.value: {
                "description": "Information for the error that occurred",
                "schema": ErrorSchema,
            },
        },
    },
)
def cancel_job(job_id: str):
    """
    Route for canceling a job matching the given job_id.
    Raises an HTTPNotFoundError if the job is not found in the database.
    Raises a ValidationError if the job is not in a cancelable state

    :param job_id: the id of the job to get
    :return: a tuple containing (json response, http status code)
    """
    _LOGGER.info("cancelling job {}".format(job_id))

    try:
        JobWorkerManager().cancel_job(job_id)
        JobWorkerManager().refresh()
    except JobNotFoundError:
        raise HTTPNotFoundError("could not find job with job_id {}".format(job_id))
    except JobCancelationFailureError:
        raise ValidationError(
            "job with job_id {} is not in a cancelable state".format(job_id)
        )

    return get_job(job_id)
