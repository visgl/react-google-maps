# Examples for @vis.gl/react-google-maps

The examples here serve multiple purposes. First, they should demonstrate
the abilities and common patterns for how to achieve things for users of
the library and serve as a source of inspiration.

At the same time, they should also act as some sort of end-to-end
testing stage during development of new features. Validating that all
examples are still working should be part of the development process
(automated if possible).

All examples are fully self-contained and can be run as independent
applications, even when the entire directory is copied elsewhere.
Users should be able to just run `npm i` and `npm start` to start any
example.

To run the examples during development of the library, we have
additional scripts to start the example in the context of the library,
using the library itself and its dependencies instead of those locally
installed in the example folder.

All examples should contain a link to a CodeSandbox environment where the
example can be played with right away.

## Writing examples

Examples should typically focus on demonstrating a single feature or a
set of features in a comprehensive way, and they should reflect what we
think are "ideal ways" to solve a specific problem.

The code should try to avoid or hide clutter and unrelated concepts.
For example, if you want to show how different types of marker could be
created, functions used to prepare data to show should be hidden away.

### Create the example

- you can start off by copying the `./examples/_template` folder for
  your example. This will contain the config-files needed and some
  basic setup that is the same for all examples. The new directory-name will be
  the "example id" and should be in 'kebap-case' (we'll need that id later).
- you can develop the example independently of the library as a standalone
  mini-application (using `npm i` and `npm start` to start the vite dev-server).
- you can install additional dependencies. However, in that case, we can't
  currently include the example on the 'Examples' page of the website (something
  we could look into, but for now it's not working due to the way the website
  is built)
- make sure to also edit the title, description and sourcecode links in the
  `README.md`, `index.html`, and `./src/control-panel.tsx` files.

### Adding examples to the website

- create the example page in `./website/src/examples/your-example-id.mdx`
- add the example to `./website/src/examples-sidebar.js`
- create a 400x400 px image for the overview page and place it in
  `./website/static/images/examples/your-example-id.jpg`
- the whole website can be started in dev-mode by running `npm i` and `npm start`
  in the `./website` directory. The website build can be tested by running
  `npm run build`.
