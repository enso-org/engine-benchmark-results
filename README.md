# Stdlib and Engine benchmark results
[https://enso-org.github.io/engine-benchmark-results/](https://enso-org.github.io/engine-benchmark-results/)

This repository hosts the benchmarking data gathered from the [enso](https://github.com/enso-org/enso) repository on daily basis
in the `cache` directory as a set of json files.
It also contains VueJs sources of single-page-application website that is hosted on GitHub pages in this
repository, which uses the aforementioned data and displays them in graphs.


## Contributing
Run the dev server with `npm install && npx vite`.


### Building static sites from Vue
Run `npm run build` to build the static site.
The output will be in the `dist` directory.


## References
- https://mkay11.medium.com/how-to-deploy-your-vite-vue-3-application-in-github-pages-2023-2b842f50576a
