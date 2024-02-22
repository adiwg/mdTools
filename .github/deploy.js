const ghpages = require("gh-pages");

const githubToken = process.env.GITHUB_TOKEN;
const repoURL = `https://x-access-token:${githubToken}@github.com/jwaspin/mdTools.git`;

ghpages.publish(
  "docs",
  {
    branch: "gh-pages",
    repo: repoURL,
  },
  function (err) {
    if (err) {
      console.error("Deployment error:", err);
    } else {
      console.log("Deployment successful!");
    }
  }
);
