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
    ele.innerHTML += `<div class="banner"><a href="${url.href}"><img src="https://www.google.com/s2/favicons?domain=${domain}"><span>${domain}</span></a><span>&nbsp;&gt;</span></div><br>`;
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
        case "7500toholte.sbnation.com":
        case "www.aseaofblue.com":
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
        case "medium.freecodecamp.org":
        return Promise.resolve().then(() => {
            ele.appendChild(create_element("div", [], [
                dcTN("By "),
                r_a_a(html.querySelectorAll(`[data-action="show-user-card"]`)[1]),
                dcTN(" / "),
                html.querySelector("time"),
            ]));
            ele.appendChild(create_element("hr"));
            for (const section of html.querySelectorAll(".section-content")) {
                const b = r_a_a(section);
                for (const el of b.querySelectorAll("figure div div")) {
                    if (el.children.length > 0) {
                        const ni = el.children.length === 4 ? (r_a_a(parse_html_ele(el.children[3].textContent))) : el.children[0];
                        el.parentElement.parentElement.parentElement.replaceChild(ni, el.parentElement.parentElement);
                    }
                }
                for (const el of b.querySelectorAll("[src]")) if (el.getAttribute("src").charAt(0) === "/") el.setAttribute("src", url.origin + el.getAttribute("src"));
                ele.appendChild(b);
            }
        });
        case "www.wired.com":
        return Promise.resolve().then(() => {
            ele.appendChild(r_a_a(html.querySelector("#articleTitle")));
            const meta = html.querySelector(`.meta-list`);
            ele.appendChild(create_element("div", [], [
                dcTN("By "),
                r_a_a(meta.querySelector(`[itemprop="author"]`).firstElementChild),
                dcTN(" on "),
                r_a_a(meta.querySelector(".date-mdy")),
                dcTN(" at "),
                r_a_a(meta.querySelector(".date-gia")),
            ]));
            ele.appendChild(create_element("hr"));
            console.log(html.querySelector("main"));
            for (const p of html.querySelectorAll("main div p, main div figure")) {
                console.log(p);
                ele.appendChild(r_a_a(p));
            }
        });
        case "techcrunch.com":
        return Promise.resolve().then(() => {
            ele.appendChild(r_a_a(html.querySelector(".article__title")));
            ele.appendChild(r_a_a(html.querySelector(".article__byline")));
            ele.appendChild(create_element("hr"));
            ele.appendChild(r_a_a(html.querySelector(".article__featured-image")));
            const cont = html.querySelector(".article-content");
            const em = [...cont.querySelectorAll(".embed")];
            for (const item of em) item.remove();
            ele.appendChild(r_a_a(cont));
        });
        case "www.vice.com":
        case "motherboard.vice.com":
        case "tonic.vice.com":
        case "free.vice.com":
        case "munchies.vice.com":
        case "garage.vice.com":
        return Promise.resolve().then(() => {
            ele.appendChild(r_a_a(html.querySelector(".article__title")));
            ele.appendChild(r_a_a(html.querySelector(".article__dek")));
            ele.appendChild(create_element("div", [], [
                dcTN("By "),
                r_a_a(html.querySelector(".contributor__link")),
                dcTN(" on "),
                dcTN(html.querySelector(".article__contributions__publishdate").textContent)
            ]));
            ele.appendChild(create_element("hr"));
            const aiw = html.querySelector(".article_img_wrap");
            if (aiw !== null) ele.appendChild(create_element("img", [["src",aiw.firstElementChild.firstElementChild.dataset.src]]));
            const ab = html.querySelector(".article__body");
            for (const e of ab.querySelectorAll(".article__embed")) e.remove();
            ele.appendChild(r_a_a(ab));
        });
        default:
        return Promise.resolve().then(() => {
            ele.children[1].remove();
            ele.appendChild(document.createElement("hr"));
            ele.appendChild(document.createElement("h1"));
            ele.children[2].innerHTML = `The domain ${domain} is not supported yet. Sorry!`;
            ele.appendChild(create_element("p", [], [
                dcTN(`Want us to add support for this domain? Sumbit a proposal `),
                create_element("a", [["href",`https://github.com/nektro/reader/issues/new?title=${encodeURIComponent(domain)}&body=${encodeURIComponent(url.href)}`]], [dcTN("here")]),
                dcTN("! And make sure to upvote proposals that already exist!"),
            ]));
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
