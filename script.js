/**
 */
//
const here = new URL(location.href);
const PROXY = "https://cors.io/?";

//
if (!(here.searchParams.has("url"))) {
    //
    console.log("load index");
    const ele = document.getElementById("section-main");
    ele.removeAttribute("hidden");
    ele.children[3].addEventListener("click", function() {
        location.assign(`./?url=${ele.children[2].children[1].value}`);
    });
}
else {
    //
    console.log("load article");
    const ele = document.getElementById("section-article");
    ele.removeAttribute("hidden");
    const url = new URL(here.searchParams.get("url"));
    //
    Promise.resolve(PROXY + url.href)
    .then(x => fetch(x))
    .then(x => x.text())
    .then(x => parse_html(x))
    .then(x => load_article(ele, url, x))
}

//
//
function load_article(ele, url, html) {
    const domain = url.hostname;
    ele.children[0].remove();
    ele.innerHTML += `<div class="banner"><a href="${url.href}"><img src="./icons/${domain}.png"><span>${domain}</span></a><span>&nbsp;&gt;</span></div><br>`;
    document.title = html.querySelector("title").textContent + " - Reader by Nektro";
    
    switch (domain) {
        case "www.polygon.com":
        return Promise.resolve().then(() => {
            const e1 = (html.querySelector("div.c-entry-hero__content.l-segment.l-feature"));
            e1.children[0].remove();
            Array.from(e1.querySelectorAll("[class]")).forEach(v => v.removeAttribute("class"));
            Array.from(e1.children).forEach(v => ele.appendChild(v));
            ele.appendChild(document.createElement("hr"));
            const e2 = (html.querySelector("div.c-entry-content"));
            Array.from(e2.querySelectorAll("[id]")).forEach(v => v.removeAttribute("id"));
            Array.from(e2.querySelectorAll("section")).forEach(v => v.remove());
            Array.from(e2.children).forEach(v => ele.appendChild(v));
            ele.appendChild(document.createElement("hr"));
        });
        default:
        return Promise.resolve().then(() => {
            ele.children[0].remove();
            ele.children[0].remove();
            ele.appendChild(document.createElement("h1"));
            ele.children[0].innerHTML = `The domain ${domain} is not supported. Sorry!`;
        });
    }
}
function parse_html(string) {
    const element = document.createElement("html");
    element.innerHTML = string;
    return element;
}
function create_element(name, attrs, chlds) {
    const ele = document.createElement(name);
    for (const at of (attrs || [])) ele.setAttribute(at[0], at[1]);
    for (const cn of (chlds || [])) ele.appendChild(cn);
    return ele;
}
function dcTN(string) {
    return document.createTextNode(string);
}
function remove_all_attributes(element) {
    const attrs = [...element.attributes];
    for (const at of attrs)
        if (!(["src","width","height","alt","href"].includes(at.nodeName)))
            element.removeAttribute(at.nodeName);
    for (const el of element.children)
        remove_all_attributes(el);
    return element;
}
