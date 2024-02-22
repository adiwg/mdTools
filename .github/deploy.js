const ghpages = require("gh-pages");

if (!process.env.GITHUB_TOKEN) {
  console.error("GITHUB_TOKEN is not set");
  process.exit(1);
}

const options = {
  branch: "gh-pages",
  repo: `https://${process.env.GITHUB_TOKEN}:x-oauth-basic@github.com/jwaspin/mdTools.git`,
  user: {
    name: "GH Pages Bot",
    email: "noreply@github.com",
  },
  dotfiles: true,
};

ghpages.publish("docs", options, function (err) {
  if (err) {
    console.error("Deployment failed", err);
    process.exit(1);
  } else {
    console.log("Deployment successful!");
  }
});
