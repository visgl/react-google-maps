# Contributing

**Thanks for taking the time to contribute!**

PRs and bug reports are welcome, and we are actively looking for new maintainers.

## Setting Up Dev Environment

The **main** branch is the active development branch.

Building react-google-maps locally from the source requires node.js `>=8`.
We use npm to manage the dependencies.

```bash
git checkout main
npm install
npm run test
```

Test:

```bash
npm run test
```

## Pull Requests

Any intended change to the code base must open a [pull request](https://help.github.com/articles/creating-a-pull-request/) and be approved. 

Generally speaking, all PRs are open against the `main` branch, unless the feature being affected no longer exists on main.

### PR Checklist

- [ ] Tests
  + `npm run test` must be successful.
  + New code should be covered by unit tests whenever possible.

- [ ] Documentation
  + If public APIs are added/modified, update component documentation in `docs/api-reference`.
  + Breaking changes and deprecations must be added to `docs/upgrade-guide.md`.
  + Noteworthy new features should be added to `docs/whats-new.md`.

- [ ] Description on GitHub
  + Link to relevant issue.
  + Label with a milestone (latest release or vNext).
  + If public APIs are added/modified, describe the intended behavior.
  + If visual/interaction is affected, consider attaching a screenshot/GIF.

## Release

react-google-maps follows the [Semantic Versioning](https://semver.org/) guidelines. Steps for publishing releases can be found [here](https://www.github.com/visgl/tsc/tree/master/developer-process).


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
