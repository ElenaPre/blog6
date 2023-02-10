"use strict";
const optArticleSelector = ".post",
  optTitleSelector = ".post-title",
  optTitleListSelector = ".titles",
  optArticleTagsSelector = ".post-tags .list",
  optArticleAuthorSelector = ".post .post-author",
  optTagsListSelector = ".tags.list",
  optCloudClassCount = 5,
  optCloudClassPrefix = "tag-size-";
function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const aktivLinks = document.querySelectorAll(".titles a.active");
  const articleSelector = clickedElement.getAttribute("href");
  const targetArticle = document.querySelector(articleSelector);
  const articles = document.querySelectorAll(".post");
  for (let aktivLink of aktivLinks) {
    aktivLink.classList.remove("active");
  }
  clickedElement.classList.add("active");

  for (let article of articles) {
    article.classList.remove("active");
  }
  targetArticle.classList.add("active");
}

function generateTitleLinks(customSelector = "") {
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(
    optArticleSelector + customSelector
  );
  titleList.innerHTML = "";
  let html = "";

  for (let article of articles) {
    const articleID = article.getAttribute("id");
    const titleArticle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML =
      '<li><a href="#' + articleID + '">' + titleArticle + "</a></li>";
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll(".titles a");

  for (let link of links) {
    link.addEventListener("click", titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagParams(tags) {
  let params = {};
  params.max = 0;
  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
  }
  params.min = params.max;
  for (let tag in tags) {
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const delta = params.max - params.min;
  const step = delta / optCloudClassCount;
  let classObj = {};
  let result = 0;
  for (let i = 1; i <= optCloudClassCount; i++) {
    classObj[i] = Math.floor(params.min + step * i);
  }
  for (let obj in classObj) {
    if (count <= classObj[obj] && count >= classObj[obj] - 1) {
      result = obj;
    }
  }

  return result;
}

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    const articleTags = article.getAttribute("data-tags");
    const tagsArray = articleTags.split(" ");
    let html = "";
    for (let tag of tagsArray) {
      const linkHTML = '<li> <a href="#tag-' + tag + '">' + tag + "</a></li>";
      html = html + linkHTML + " ";
      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector(optTagsListSelector);
  let allTagsHtml = "";
  for (let tag in allTags) {
    const tagParams = calculateTagParams(allTags);
    allTagsHtml +=
      '<a class="tag-size-' +
      calculateTagClass(allTags[tag], tagParams) +
      '" href="#' +
      tag +
      '">' +
      tag +
      "(" +
      allTags[tag] +
      ")" +
      "<br>";
  }
  console.log(allTagsHtml);

  tagList.innerHTML = allTagsHtml;
}
generateTags();

function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute("href");
  const tag = href.replace("#tag-", "");
  const activeTags = document.querySelectorAll(' a.active[href^="#tag-"]');
  for (let activeTag of activeTags) {
    activeTag.classList.remove("active");
  }
  const linksHref = document.querySelectorAll('a[href="' + href + '"]');
  for (let linkHref of linksHref) {
    linkHref.classList.add("active");
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  const tagLinks = document.querySelectorAll(".post-tags .list a");
  for (let tagLink of tagLinks) {
    tagLink.addEventListener("click", tagClickHandler);
  }
}
addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const author = article.getAttribute("data-author");
    const html = '<a href="#' + author + '">' + author + "</a>";
    authorWrapper.innerHTML = html;
  }
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute("href");
  const authorName = href.replace("#", "");
  const articlesAuthor = document.querySelectorAll('a[href="' + href + '"]');
  for (let articleAuthor of articlesAuthor) {
    articleAuthor.classList.add("active");
  }
  generateTitleLinks('[data-author="' + authorName + '"]');
}

function addClickListenersToAuthors() {
  const articles = document.querySelectorAll(".post .post-author a");

  for (let article of articles) {
    article.addEventListener("click", authorClickHandler);
  }
}
addClickListenersToAuthors();
