# Projects

Each subdirectory of this folder is one project shown in the **Projects**
section of the site. To add a project, create a new folder here containing a
`content.yaml` file (plus any local assets it references), then commit and push
to the `master` branch. `index.js` reads this folder's subdirectories through
the GitHub contents API and renders one card per `content.yaml`, so the new
project appears automatically once it is on `master` — there is no build step
and no list to update.

## `content.yaml` schema

```yaml
---
  title: "Project Name"                 # required
  description: "One or two sentences."   # required

  thumbnail: "diagram.png"              # optional; a file in this folder
  video: "https://youtu.be/xxxxxxxxxxx" # optional; any URL
  github: "https://github.com/you/repo" # optional; any URL
  year: 2024                            # optional; sort key (newest first).
                                        #   Defaults to the newest paper year.

  papers:                              # optional; one entry per publication
    2024:
      venue: "ICRA"
      url: "paper.pdf"                  # a file in this folder, or a URL
    2022:
      venue: "EuroSec"
      url: "https://example.org/older-paper.pdf"
```

Any path that does not start with `http://` or `https://` is treated as a file
inside the project's own folder. A project is skipped if it is missing `title`
or `description`.
