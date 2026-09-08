
document.body.style.setProperty('--titlePageHeight', document.getElementById("navbar").offsetHeight / window.innerHeight);

// get a proportion of how much of the page we have scrolled
window.addEventListener('scroll', () => {
  //document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
  document.body.style.setProperty('--scroll', window.pageYOffset / document.getElementById("navbar").offsetHeight);
}, false);

// shrink navigation bar for aesthetic purposes
function shrinkNavbar() {
  document.getElementById("navbar").style.padding = "2vh 2vw";
  document.getElementById("logo").style.fontSize = "250%";
}

// revert navigation bar to original settings
function growNavbar() {
  document.getElementById("navbar").style.padding = "";
  document.getElementById("logo").style.fontSize = "";
}

// shrinks the navigation bar when scrolling
//window.addEventListener("scroll", navbarScroll);
function navbarScroll() {
  if (document.body.scrollTop > 10|| document.documentElement.scrollTop > 10) {
    setTimeout(shrinkNavbar, 500);
  } else {
    setTimeout(growNavbar, 500);
  }
}

/*
var isScrolling = false;
var scrollingTimeout = null;
// waits til scrolling stops to run something
window.addEventListener("scroll", setScroll)
function setScroll() {
  if(scrollingTimeout != null) {
    window.clearTimeout(scrollingTimeout);
  }
  isScrolling = true;
  scrollingTimeout = setTimeout(function(){isScrolling = false;}, 500);
}
*/

/*
// scroll back to top of the page
function scrollUp() {
  //window.removeEventListener("scroll", navbarScroll);
  document.getElementById("heyo").scrollIntoView({behavior: "smooth", block: "start"});
  //while(isScrolling){}
  //growNavbar();
  //while(isScrolling){}
  //setTimeout(function(){window.addEventListener("scroll", navbarScroll)}, 1);
}

// scroll to link and shrink navigation bar
function scrollTo(element) {
  // stop spazzing out while scrolling
  //window.removeEventListener("scroll", navbarScroll);
  //shrinkNavbar();
  //while(isScrolling){}
  // if we're at the top, scroll down real quick to trigger the
  // navigation bar resizing event handler
  if (document.body.scrollTop == 0 || document.documentElement.scrollTop == 0) {
    window.scrollTo(0, 1);
  }
  element.scrollIntoView({behavior: "smooth", block: "start"});
  //while(isScrolling){}
  //window.addEventListener("scroll", navbarScroll);
}

// shrink navigation bar when we click on a link
//document.getElementById("logo").addEventListener("click", scrollUp);
//document.getElementById("aboutLink").addEventListener("click", function () {scrollTo(document.getElementById("about"))});
//document.getElementById("projectsLink").addEventListener("click", function () {scrollTo(document.getElementById("projects"))});
*/


/* ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
  projects section
    The #projectList is built here at runtime, one card per
    subdirectory of projects/. The list of subdirectories comes from
    the public GitHub contents API (so it only reflects what has been
    pushed to the master branch); each projects/<slug>/content.yaml is
    then fetched over a normal relative path and parsed with js-yaml.

    content.yaml schema (title and description are required, the rest
    are optional -- see projects/README.md):
      title:       "Project Name"
      description:  "One or two sentences."
      thumbnail:    "diagram.png"    # a file in the project folder
      video:        "https://..."    # any URL
      github:       "https://..."    # any URL
      year:         2024             # sort key; defaults to newest paper year
      papers:
        2024:
          venue:  "ICRA"
          url:    "paper.pdf"   # a file in the project folder, or a URL
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ */
(function () {
  var REPO = "chpmk98/chpmk98.github.io";
  var BRANCH = "master";
  var list = document.getElementById("projectList");
  if (!list) return;

  // An absolute URL is used as-is; anything else names a file that
  // lives inside that project's folder.
  function resolveUrl(slug, path) {
    if (/^https?:\/\//i.test(path)) return path;
    var parts = String(path).split("/").map(encodeURIComponent);
    return "projects/" + encodeURIComponent(slug) + "/" + parts.join("/");
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    }
    if (text != null) node.textContent = text;
    return node;
  }

  function externalLink(href, label) {
    return el("a", { href: href, target: "_blank", rel: "noopener" }, label);
  }

  function latestPaperYear(papers) {
    if (!papers) return 0;
    return Object.keys(papers).reduce(function (max, y) {
      var n = parseInt(y, 10);
      return n > max ? n : max;
    }, 0);
  }

  function sortKey(data) {
    var y = parseInt(data.year, 10);
    return isNaN(y) ? latestPaperYear(data.papers) : y;
  }

  function renderProject(slug, data) {
    var card = el("div", { class: "project" });

    if (data.thumbnail) {
      var img = el("img", {
        class: "project-thumb",
        src: resolveUrl(slug, data.thumbnail),
        alt: ""
      });
      img.onerror = function () { img.remove(); };
      card.appendChild(img);
    }

    var body = el("div", { class: "project-body" });
    body.appendChild(el("h2", { class: "project-name" }, data.title || slug));
    if (data.description) {
      body.appendChild(el("p", { class: "project-desc" }, data.description));
    }

    var links = el("div", { class: "project-links" });
    if (data.papers) {
      Object.keys(data.papers)
        .sort(function (a, b) { return parseInt(b, 10) - parseInt(a, 10); })
        .forEach(function (year) {
          var paper = data.papers[year] || {};
          if (!paper.url) return;
          var label = [paper.venue, year].filter(Boolean).join(" ") || "Paper";
          links.appendChild(externalLink(resolveUrl(slug, paper.url), label));
        });
    }
    if (data.video) links.appendChild(externalLink(data.video, "Video"));
    if (data.github) links.appendChild(externalLink(data.github, "GitHub"));
    if (links.childNodes.length) body.appendChild(links);

    card.appendChild(body);
    return card;
  }

  function note(build) {
    list.innerHTML = "";
    var p = el("p", { class: "project-note" });
    build(p);
    list.appendChild(p);
  }

  // The subdirectory list normally comes from the GitHub contents API. For
  // local preview (before pushing), pass the folders by hand in the URL:
  //   index.html?projects=kayak,nebula
  var override = new URLSearchParams(location.search).get("projects");
  var slugSource = override
    ? Promise.resolve(override.split(",").map(function (s) { return s.trim(); }).filter(Boolean))
    : fetch("https://api.github.com/repos/" + REPO + "/contents/projects?ref=" + BRANCH, {
        headers: { Accept: "application/vnd.github+json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("GitHub contents API responded " + res.status);
          return res.json();
        })
        .then(function (entries) {
          return entries
            .filter(function (e) { return e.type === "dir"; })
            .map(function (e) { return e.name; });
        });

  slugSource
    .then(function (slugs) {
      return Promise.all(slugs.map(function (slug) {
        return fetch(resolveUrl(slug, "content.yaml"))
          .then(function (res) {
            if (!res.ok) throw new Error(slug + "/content.yaml responded " + res.status);
            return res.text();
          })
          .then(function (text) { return { slug: slug, data: jsyaml.load(text) || {} }; })
          .catch(function (err) { console.error(err); return null; });
      }));
    })
    .then(function (projects) {
      projects = projects.filter(function (p) {
        return p && p.data && p.data.title && p.data.description;
      });
      if (!projects.length) {
        note(function (p) { p.textContent = "No projects to show yet."; });
        return;
      }
      projects.sort(function (a, b) {
        var d = sortKey(b.data) - sortKey(a.data);
        return d !== 0 ? d : (a.data.title > b.data.title ? 1 : -1);
      });
      list.innerHTML = "";
      projects.forEach(function (p) {
        list.appendChild(renderProject(p.slug, p.data));
      });
    })
    .catch(function (err) {
      console.error(err);
      note(function (p) {
        p.appendChild(document.createTextNode("Couldn’t load the project list. Browse it on "));
        p.appendChild(externalLink(
          "https://github.com/" + REPO + "/tree/" + BRANCH + "/projects", "GitHub"));
        p.appendChild(document.createTextNode("."));
      });
    });
})();