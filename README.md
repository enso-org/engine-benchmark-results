# Stdlib and Engine benchmark results
This repository hosts results from benchmarks from the [enso repo](https://github.com/enso-org/enso).
This repo has GH pages enabled and hosts them at [https://enso-org.github.io/engine-benchmark-results/](https://enso-org.github.io/engine-benchmark-results/).

The benchmarks are scheduled in [Benchmark Engine](https://github.com/enso-org/enso/actions/workflows/engine-benchmark.yml)
and [Benchmark Standard Libraries](https://github.com/enso-org/enso/actions/workflows/std-libs-benchmark.yml) GH Actions.
The results from these actions are gathered by another GH Action [Benchmarks Upload](https://github.com/enso-org/enso/actions/workflows/bench-upload.yml)
and uploaded to this repo, inside `cache` directory.
Results are JSON files inside the `cache` directory.
There is a special `cache/index.json` file that maps json file names to their timestamps.

The `Benchmarks Upload` actions the runs [website_regen.py](https://github.com/enso-org/enso/blob/develop/tools/performance/engine-benchmarks/website_regen.py) script.

For more info, see:
- [enso-org/enso:tools/performance/engine-benchmarks](https://github.com/enso-org/enso/blob/develop/tools/performance/engine-benchmarks/README.md)
  - This is a directory with Python package that deals with benchmarks - regenerate HTML website, gather results from GH artifacts and upload them to this repo, etc.
- [enso-org/enso:docs/infrastructure/benchmarks.md](https://github.com/enso-org/enso/blob/develop/docs/infrastructure/benchmarks.md#visualization)
