/**
 */
//
const here = new URL(location.href);
const PROXY = "https://cors.io/?";

//
if (!(here.searchParams.has("url"))) {
    const ele = document.getElementById("section-main");
    ele.removeAttribute("hidden");
    ele.children[3].addEventListener("click", function() {
        location.assign(`./?url=${ele.children[2].children[1].value}`);
    });
}
else {
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
function load_article(ele, url, html) {
    const domain = url.hostname;
    ele.children[0].remove();
    ele.innerHTML += `<div class="banner"><a href="${url.href}"><img src="./icons/${domain}.png"><span>${domain}</span></a><span>&nbsp;&gt;</span></div><br>`;
    document.title = html.querySelector("title").textContent + " - Reader by Nektro";
    
    switch (domain) {
        case "www.polygon.com":
        case "www.theverge.com":
        case "www.vox.com":
        case "www.sbnation.com":
        case "www.eater.com":
        case "www.curbed.com":
        case "www.recode.net":
        case "www.theringer.com":
        case "product.voxmedia.com":
        return Promise.resolve().then(() => {
            ele.appendChild(r_a_a(html.querySelector(".c-page-title")));
            ele.appendChild(r_a_a(html.querySelector(".c-entry-summary")));
            ele.appendChild(r_a_a(html.querySelector(".c-byline")));
            ele.appendChild(document.createElement("hr"));
            const e2 = (html.querySelector("div.c-entry-content"));
            Array.from(e2.querySelectorAll("section")).forEach(v => v.remove());
            Array.from(e2.querySelectorAll("aside")).forEach(v => v.remove());
            Array.from(r_a_a(e2).children).forEach(v => ele.appendChild(v));
            ele.appendChild(document.createElement("hr"));
        });
        case "medium.com":
        return Promise.resolve().then(() => {
            ele.appendChild(create_element("div", [], [
                dcTN("By "),
                r_a_a(html.querySelectorAll(`[data-action="show-user-card"]`)[1]),
                dcTN(" / "),
                html.querySelector("time"),
            ]));
            ele.appendChild(create_element("hr"));
            const a = html.querySelector(".section-content");
            const b = r_a_a(a);
            for (const el of b.querySelectorAll("figure div div")) {
                if (el.children.length > 0) {
                    const ni = (r_a_a(parse_html_ele(el.children[3].textContent)));
                    el.parentElement.parentElement.parentElement.replaceChild(ni, el.parentElement.parentElement);
                }
            }
            ele.appendChild(b);
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
        r_a_a(el);
    return element;
}
function parse_html_ele(string) {
    return parse_html(string).children[1].children[0];
}
function r_a_a(element) {
    return remove_all_attributes(element);
}
