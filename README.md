# PRJ666 - Group 1 - Chef Choice

**Please use YARN instead of NPM**

## Getting Started

First, obtain the necessary environment variables that you will need to to store in `.env.local`

then, run the development server:

```bash
yarn        // install dependencies
yarn dev    // run development server
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Cypress Testing
Sample tests are located in `cypress/samples`. You can manually run these tests with `yarn run cypress open` and selecting the appropriate test. When running manually, please ensure that the server is actually running. Otherwise, the existing tests will run automatically in the pipeline on GitHub.

## Rules

- In order to add a feature, enhancement or bug fix, make a Pull Request (PR) to the `develop` branch.
- Automatic merging of a PR is not allowed. The PR must be reviewed by another team member.
- Make sure to include a description in the PR and link any relevant issue.
- Any merge conflicts are to be handled locally by the author of the PR.
