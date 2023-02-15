"use strict";
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector("#template-tag-cloud-link").innerHTML),
  authorListLink: Handlebars.compile(document.querySelector("#template-author-list-link").innerHTML)
}
const optArticleSelector = ".post",
  optTitleSelector = ".post-title",
  optTitleListSelector = ".titles",
  optArticleTagsSelector = ".post-tags .list",
  optArticleAuthorSelector = ".post .post-author",
  optTagsListSelector = ".tags.list",
  optAuthoListSelector=".list.authors",
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
    const linkHTMLData = {id: articleID, title: titleArticle};
  const linkHTML = templates.articleLink(linkHTMLData);
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
  let classObj = [];
  let result = 0;
  for (let i = 1; i <=optCloudClassCount; i++) {
    classObj[i-1] = Math.floor(params.min + step *i);
  }
  for(let j=0; j<classObj.length; j++){
  if (j==0){
if(count<=classObj[j]){
result=j+1;
  }
} if(j>0){
  if(count<=classObj[j] && count>classObj[j-1]){
    result=j+1;
  }}}
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
      const tagHTMLData = {id:tag, title:tag};
      const linkHTML = templates.tagLink(tagHTMLData);
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
  const allTagsData = {tags: []};
  for (let tag in allTags) {
    //min and max value of the tags
    const tagsParams = calculateTagParams(allTags);
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
  }
   tagList.innerHTML = templates.tagCloudLink(allTagsData);
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
  const tagsList =document.querySelectorAll(".tags.list a");
  for(let tag of tagsList){
    tag.addEventListener("click",tagClickHandler);}
}
addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
let allAuthors =[];
  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const author = article.getAttribute("data-author");
   const authorHTMLData ={id:author, title:author};
   const html = templates.authorLink(authorHTMLData); 
    authorWrapper.innerHTML = html;
    if(!allAuthors.includes(author)){
    allAuthors.push(author);}
  }
  
const authorList = document.querySelector(optAuthoListSelector);
const allAuthorsData = {authors: []};
  for(let author of allAuthors){
    // authorListHtml+='<li><a href="#' + author + '">' + author + '</a></li>';
    allAuthorsData.authors.push({
      author:author
    })
  }
  console.log(allAuthorsData);
  authorList.innerHTML=templates.authorListLink(allAuthorsData);

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
  const authorsList =document.querySelectorAll(".authors.list a");
 for(let author of authorsList){
  author.addEventListener("click",authorClickHandler);
 }
}
addClickListenersToAuthors();
function addClickListenersToAuthorsList(){
  
}
addClickListenersToAuthorsList();

