.PHONY: build docs test

BUILDDIR := $(PWD)
PYCHECKDIRS := tests src utils scripts setup.py
JSCHECKDIRS := src
DOCDIR := docs

# run checks on all files for the repo
quality:
	@echo "Running python quality checks";
	black --check $(PYCHECKDIRS);
	isort --check-only $(PYCHECKDIRS);
	flake8 $(PYCHECKDIRS);
	@echo "Running js/jsx quality checks";
	yarn prettier --check $(JSCHECKDIRS);

# style the code according to accepted standards for the repo
style:
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
	sphinx-apidoc -o "$(DOCDIR)/source/" src/sparsify;
	cd $(DOCDIR) && $(MAKE) html;

# creates wheel file
build:
	@echo "Building UI";
	yarn install;
	yarn run build;
	mv -v build/* src/sparsify/ui/;
	@echo "Building python package";
	python3 setup.py sdist bdist_wheel;

# clean package
clean:
	rm -rf .pytest_cache;
	rm -rf docs/_build docs/build;
	rm -rf node_modules;
	rm -rf build;
	rm -rf dist;
	rm -rf src/sparsify/ui/*;
	rm -rf src/sparsify.egg-info;
	find $(PYCHECKDIRS) $(JSCHECKDIRS) | grep -E "(__pycache__|\.pyc|\.pyo)" | xargs rm -rf;
	find $(DOCDIR) | grep .rst | xargs rm -rf;
