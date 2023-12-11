# Writing Examples

The examples for this library serve multiple purposes. First, they should
demonstrate the abilities and common patterns for how to achieve things for
users of the library and serve as a source of inspiration.

At the same time, they should also act as some sort of end-to-end
testing stage during development of new features. Validating that all
examples are still working should be part of the development process
(automated (visual) testing for the examples would be an excellent addition to
our workflows).

And finally, the examples act as "incubator" for new features. Proposed
features should be implemented using examples first. That way, the
functionality is available to everyone by copying and adjusting the code
from the example. If these features prove to be useful and universal enough,
they will be considered to be added to the library.

## Scope of an Example

Examples should typically focus on demonstrating a single feature or a
set of features in a comprehensive way, and they should reflect what we
think are "ideal ways" to solve a specific problem.

The code should try to avoid or hide clutter and unrelated concepts.
For example, if you want to show how different types of marker could be
created, functions used to prepare data to show should be hidden away.

Examples will typically be read from top to bottom, so consider organizing
the code in a way that puts the "gist" of the example at the very top of the
main source-file.

When writing an example for a proposed feature, try to write the code for
that feature in a reusable way, such that the relevant components or hooks can
easily be copied into another project. This typically means to have
components or hooks in their own files with as few dependencies as possible
and avoid using bundler-specific features (for example, importing of css
files or using environment variables).

### Create the example

- Start off by copying the `./examples/_template` folder for
  your example. This will contain the config-files needed and some
  basic setup that is the same for all examples. The new directory-name will be
  the "example id" and should be in 'kebap-case' (we'll need that id later).
- Develop the example independently of the library as a standalone
  mini-application (using `npm install` and `npm start` to start the vite 
  dev-server).
- If you install additional dependencies, the "Examples" section of [the website](https://visgl.github.io/react-google-maps/examples/) will not be able to host your example, but you can still [link to a CodeSandbox](https://codesandbox.io/docs/learn/devboxes/synced-templates#creating-a-synced-template) for the example.
- Edit the title, description and sourcecode links in the
  `README.md`, `index.html`, and `./src/control-panel.tsx` files.

### Adding examples to the website

If you are adding an example with **no additional dependencies**:

1. Create the example page in `./website/src/examples/your-example-id.mdx`
2. Add the example to `./website/src/examples-sidebar.js`
3. Create a 400x400 px image for the overview page and place it in
   `./website/static/images/examples/your-example-id.jpg`
4. The whole website can be started in dev-mode by running `npm i` and 
   `npm start` in the `./website` directory. The website build can be tested 
   by running `npm run build`.

If you are adding an example **with additional dependencies**:

1. Create a 400x400 px image for the overview page and place it in `./website/static/images/examples/your-example-id.jpg`
2. Add the example to `./website/src/examples-sidebar.js` as an [external link](https://docusaurus.io/docs/sidebar/items#sidebar-item-link) to [a CodeSandbox](https://codesandbox.io/docs/learn/devboxes/synced-templates#creating-a-synced-template) based on the title of your new example folder in the `./examples` folder.
