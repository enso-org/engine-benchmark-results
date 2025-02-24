# Stdlib and Engine benchmark results
This repository hosts results from benchmarks from the [enso repo](https://github.com/enso-org/enso).
This repo has GH pages enabled and hosts them at [https://enso-org.github.io/engine-benchmark-results/](https://enso-org.github.io/engine-benchmark-results/).
It is a VueJS single-page-application.

## Data
The benchmarks are scheduled in [Benchmark Engine](https://github.com/enso-org/enso/actions/workflows/engine-benchmark.yml)
and [Benchmark Standard Libraries](https://github.com/enso-org/enso/actions/workflows/std-libs-benchmark.yml) GH Actions.
The results from these actions are gathered by another GH Action [Benchmarks Upload](https://github.com/enso-org/enso/actions/workflows/bench-upload.yml)
and uploaded to this repo, inside `cache` directory.
Results are JSON files inside the `cache` directory.
There is a special `cache/index.json` file that maps json file names to their timestamps.

The `Benchmarks Upload` actions the runs [website_regen.py](https://github.com/enso-org/enso/blob/develop/tools/performance/engine-benchmarks/website_regen.py) script.

## Contributing
When cloning the repo, it is recommended to truncate the history to save time:
```bash
git clone --depth 1
```
(because this repo contains some big HTML files).
Run the dev server with `npm install && npx vite`.


### Building static sites from Vue
Run `npm run build` to build the static site.
The output will be in the `dist` directory.
Run `npm run preview` to serve the `dist` directory.

## Technology stack
- [Vue-chartjs](https://vue-chartjs.org/)
  - For plotting
- [Pinia](https://pinia.vuejs.org/) 
  - For global state management
- [Vuetify](https://vuetifyjs.com/en/) 
  - Material component library for Vue

## References
- [enso-org/enso:tools/performance/engine-benchmarks](https://github.com/enso-org/enso/blob/develop/tools/performance/engine-benchmarks/README.md)
    - This is a directory with Python package that deals with benchmarks - regenerate HTML website, gather results from GH artifacts and upload them to this repo, etc.
- [enso-org/enso:docs/infrastructure/benchmarks.md](https://github.com/enso-org/enso/blob/develop/docs/infrastructure/benchmarks.md#visualization)
- https://mkay11.medium.com/how-to-deploy-your-vite-vue-3-application-in-github-pages-2023-2b842f50576a

## Legacy static webpages
The old static webpages are still generated inside `stdlib-benchs.html`
and `engine-benchs.html` files and included in the deployed GH pages.
They will be removed as soon as the data format is changed.
Accessible via these URLs:
- https://enso-org.github.io/engine-benchmark-results/stdlib-benchs.html
- https://enso-org.github.io/engine-benchmark-results/engine-benchs.html
