.PHONY: build docs test

BUILDDIR := $(PWD)
BUILD_ARGS :=  # set nightly to build nightly release
PYCHECKDIRS := examples tests src utils scripts setup.py
PYCHECKGLOBS := 'examples/**/*.py' 'scripts/**/*.py' 'src/**/*.py' 'tests/**/*.py' 'utils/**/*.py' setup.py
JSCHECKDIRS := src public
JSCHECKGLOBS := 'public/**/*.html' 'public/**/*.js' 'public/**/*.css' 'src/**/*.html' 'src/**/*.jsx' 'tests/**/*.jsx'
DOCDIR := docs
MDCHECKGLOBS := 'docs/**/*.md' 'docs/**/*.rst' 'examples/**/*.md' 'notebooks/**/*.md' 'scripts/**/*.md'
MDCHECKFILES := CODE_OF_CONDUCT.md CONTRIBUTING.md DEVELOPING.md README.md
SPARSEZOO_TEST_MODE := "true"

# run checks on all files for the repo
quality:
	@echo "Running copyright checks";
	python utils/copyright.py quality $(PYCHECKGLOBS) $(JSCHECKGLOBS) $(MDCHECKGLOBS) $(MDCHECKFILES)
	@echo "Running python quality checks";
	black --check $(PYCHECKDIRS);
	isort --check-only $(PYCHECKDIRS);
	flake8 $(PYCHECKDIRS);
	@echo "Running js/jsx quality checks";
	yarn prettier --check $(JSCHECKDIRS);

# style the code according to accepted standards for the repo
style:
	@echo "Running copyrighting";
	python utils/copyright.py style $(PYCHECKGLOBS) $(JSCHECKGLOBS) $(MDCHECKGLOBS) $(MDCHECKFILES)
	@echo "Running python styling";
	black $(PYCHECKDIRS);
	isort $(PYCHECKDIRS);
	@echo "Running js/jsx styling";
	yarn prettier --write $(JSCHECKDIRS);

# run tests for the repo
test:
	@echo "Running python tests";
	@pytest;

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
	@echo "Building UI";
	yarn install;
	yarn run build;
	mv -v build/* src/sparsify/ui/;
	@echo "Building python package";
	python3 setup.py sdist bdist_wheel $(BUILD_ARGS);

# clean package
clean:
	rm -rf .pytest_cache;
	rm -rf docs/_build docs/build;
	rm -rf build;
	rm -rf dist;
	find src/sparsify/ui/* | grep -v .gitkeep | xargs rm -rf;
	rm -rf src/sparsify.egg-info;
	find $(PYCHECKDIRS) $(JSCHECKDIRS) | grep -E "(__pycache__|\.pyc|\.pyo)" | xargs rm -rf;
