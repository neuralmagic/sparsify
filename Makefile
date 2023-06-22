.PHONY: build docs test

BUILDDIR := $(PWD)
BUILD_ARGS :=  # set nightly to build nightly release
PYCHECKDIRS := examples tests src utils scripts setup.py
PYCHECKGLOBS := 'examples/**/*.py' 'scripts/**/*.py' 'src/**/*.py' 'tests/**/*.py' 'utils/**/*.py' setup.py
DOCDIR := docs
MDCHECKGLOBS := 'docs/**/*.md' 'docs/**/*.rst' 'examples/**/*.md' 'notebooks/**/*.md' 'scripts/**/*.md'
MDCHECKFILES := CODE_OF_CONDUCT.md CONTRIBUTING.md DEVELOPING.md README.md
SPARSEZOO_TEST_MODE := "true"
PYTEST_ARGS ?= ""
INTEGRATION_TEST_ARGS ?= ""
ifneq ($(findstring auto,$(TARGETS)),auto)
    PYTEST_ARGS := $(PYTEST_ARGS) --ignore tests/sparsify/auto
	INTEGRATION_TEST_ARGS := $(INTEGRATION_TEST_ARGS) --ignore tests/integration/auto
endif
ifneq ($(findstring package,$(TARGETS)),package)
    PYTEST_ARGS := $(PYTEST_ARGS) --ignore tests/sparsify/package
	INTEGRATION_TEST_ARGS := $(INTEGRATION_TEST_ARGS) --ignore tests/integration/package
endif

# run checks on all files for the repo
quality:
	@echo "Running copyright checks";
	python utils/copyright.py quality $(PYCHECKGLOBS) $(MDCHECKGLOBS) $(MDCHECKFILES)
	@echo "Running python quality checks";
	black --check $(PYCHECKDIRS);
	isort --check-only $(PYCHECKDIRS);
	flake8 $(PYCHECKDIRS);

# style the code according to accepted standards for the repo
style:
	@echo "Running copyrighting";
	python utils/copyright.py style $(PYCHECKGLOBS) $(MDCHECKGLOBS) $(MDCHECKFILES)
	@echo "Running python styling";
	black $(PYCHECKDIRS);
	isort $(PYCHECKDIRS);

# run tests for the repo
test:
	@echo "Running python tests";
	SPARSEZOO_TEST_MODE="true" pytest tests/sparsify --ignore tests/integration $(PYTEST_ARGS);

# run end to end integration tests
test_integration:
	@echo "Running integration tests";
	SPARSEZOO_TEST_MODE="true" pytest tests/integration  --ignore tests/sparsify $(INTEGRATION_TEST_ARGS);

# create docs
docs:
	@echo "Running docs creation";
	export SPARSEML_IGNORE_TFV1="True"; \
			python utils/docs_builder.py --src $(DOCDIR) --dest $(DOCDIR)/build/html;

docsupdate:
	@echo "Runnning update to api docs";
	find $(DOCDIR)/api | grep .rst | xargs rm -rf;
	export SPARSEML_IGNORE_TFV1="True"; sphinx-apidoc -o "$(DOCDIR)/api" src/sparsify;

# creates wheel file
build:
	@echo "Building python package";
	python3 setup.py sdist bdist_wheel $(BUILD_ARGS);

# clean package
clean:
	rm -rf .pytest_cache;
	rm -rf docs/_build docs/build;
	rm -rf build;
	rm -rf dist;
	rm -rf src/sparsify.egg-info;
	find $(PYCHECKDIRS) | grep -E "(__pycache__|\.pyc|\.pyo)" | xargs rm -rf;
