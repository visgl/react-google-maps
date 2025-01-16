# Contributing

**Thanks for taking the time to contribute!**

PRs and bug reports are welcome, and we are actively looking for new maintainers.

Please [open a discussion][discussions] or [feature request][feat-req] before starting to work on a new feature. That way we can make sure it fits well with the overall architecture and plans of the library.

[discussions]: https://github.com/visgl/react-google-maps/discussions
[feat-req]: https://github.com/visgl/react-google-maps/issues/new?assignees=&labels=feature&projects=&template=feature-request.yml&title=%5BFeat%5D

## Goals and Philosophy

It would be great to have some level of support for most, if not all
features of the Google Maps JavaScript API.
_"Some level of support"_ is intentionally a bit vague here: Balancing the
amount of features included in this library with the effort needed to
maintain it (and thus prevent it from decaying) is going to be an ongoing
discussion.
**Features added to the library are permanent**, and need a commitment to
keep maintaining them, which is why adding features has to be considered
carefully.

The focus will be on providing an extensible library of **"low-level"
abstractions** that can be used to implement known and unknown use-cases of
the Google Maps JavaScript API in a React application.

In a lot of cases – especially when a solution needs to have a lot of
flexibility (implementing an Autocomplete component for example) and room
for opinion (generally everything with a UI) – it is preferrable to provide
a "reference implementation" with our examples that users can then copy and
adjust to their needs.

## Development Process

The default procedure for adding functionality to the library is as follows:

- new features always start as a "reference implementation" in an example
  (see also the ["Writing Examples" guide](./guides/writing-examples.md)).
- when implementing the desired feature is challenging or impossible with the
  library, that would be an excellent indicator that some abstraction is
  missing at a lower level and should be added to the library.
- If a new feature proves to be useful and universal (i.e. it can be used
  without needing much per-user customization), we will
  consider adding it to the library or providing it as a separate library.

## Setting Up Dev Environment

The **main** branch is the active development branch.

Building `@vis.gl/react-google-maps` locally from the source requires a current version of node.js.
We use npm to manage the dependencies.

```bash
git checkout main
npm install
npm run test
```

Running the full test suite:

```bash
npm run test
```

Or just the unit-tests:

```bash
npm run test:unit
```

## Pull Requests

Any intended change to the code base must open a [pull request](https://help.github.com/articles/creating-a-pull-request/) and be approved by the maintainers.

Generally speaking, all PRs are open against the `main` branch, unless the feature being affected no longer exists on main.

### PR Checklist

- [ ] Tests

  - `npm run test` must be successful.
  - New code should be covered by unit tests whenever possible.

- [ ] Documentation

  - If public APIs are added/modified, update component documentation in `docs/api-reference`.
  - Breaking changes and deprecations must be added to `docs/upgrade-guide.md`.
  - Noteworthy new features should be added to `docs/whats-new.md`.

- [ ] Description on GitHub
  - Link to relevant issue.
  - Label with a milestone (latest release or vNext).
  - If public APIs are added/modified, describe the intended behavior.
  - If visual/interaction is affected, consider attaching a screenshot/GIF.

## Release

`@vis.gl/react-google-maps` follows the [Semantic Versioning](https://semver.org/) guidelines. Steps for publishing releases can be found [here](https://www.github.com/visgl/tsc/tree/master/developer-process).

## Community Governance

vis.gl is part of the [Urban Computing Foundation](https://uc.foundation/). See the organization's [Technical Charter](https://github.com/visgl/tsc/blob/master/Technical%20Charter.md).

### Technical Steering Committee

react-google-maps development is governed by the vis.gl Technical Steering Committee (TSC).

### Maintainers

- [Martin Schuhfuss](https://github.com/usefulthink)

Maintainers of react-google-maps have commit access to this GitHub repository, and take part in the decision making process.

If you are interested in becoming a maintainer, read the [governance guidelines](https://github.com/visgl/tsc/blob/master/governance.md).

The vis.gl TSC meets monthly and publishes meeting notes via a [mailing list](https://lists.uc.foundation/g/visgl).
This mailing list can also be utilized to reach out to the TSC.

## Code of Conduct

Please be mindful of and adhere to the Linux Foundation's [Code of Conduct](https://lfprojects.org/policies/code-of-conduct/) when contributing to react-google-maps.
