### Update project version
When updating project version run one of the following commands.
> When updating version we do not want to add tag for it.

#### Patch
```sh
npm --no-git-tag-version version patch
```

#### Minor
```sh
npm --no-git-tag-version version minor
```

#### Major
```sh
npm --no-git-tag-version version major
```