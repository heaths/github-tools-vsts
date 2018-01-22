const release = require('gulp-github-release');
const tl = require('vsts-task-lib/task');

// Check if gulp exists and create the tool runner
const gulp = tl.which('gulp', true);
const gulpExec = tl.tool(gulp);

// Endpoint
const githubEndpoint = tl.getInput('githubEndpoint');
const githubEndpointUrl = tl.getEndpointUrl(githubEndpoint);
const githubEndpointToken = tl.getEndpointAuthorization(githubEndpoint);
// Inputs
const githubRepository = tl.getInput('githubRepository').split('/');
const githubTag = tl.getInput('githubTag');
const githubReleaseTitle = tl.getInput('githubReleaseTitle');
const githubReleaseNotes = tl.getInput('githubReleaseNotes');
// Booleans
const githubReleaseDraft = tl.getBoolInput('githubReleaseDraft');
const githubReleasePrerelease = tl.getBoolInput('githubReleasePrerelease');
// Paths
const manifestJson = tl.getPathInput('manifestJson');
const githubReleaseAsset = tl.getPathInput('githubReleaseAsset');

gulpExec.task('release', function() {
  gulpExec.src(githubReleaseAsset).pipe(
    release({
      token: githubEndpointToken, // or you can set an env var called GITHUB_TOKEN instead
      owner: githubRepository[0], // if missing, it will be extracted from manifest (the repository.url field)
      repo: githubRepository[1], // if missing, it will be extracted from manifest (the repository.url field)
      tag: githubTag, // if missing, the version will be extracted from manifest and prepended by a 'v'
      name: githubReleaseTitle, // if missing, it will be the same as the tag
      notes: githubReleaseNotes, // if missing it will be left undefined
      draft: githubReleaseDraft, // if missing it's false
      prerelease: githubReleasePrerelease, // if missing it's false
      manifest: require(manifestJson) // package.json from which default values will be extracted if they're missing
    })
  );
});
