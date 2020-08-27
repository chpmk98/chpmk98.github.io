
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