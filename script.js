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
    const url = new URL("https://"+here.searchParams.get("url"));
    //
    Promise.resolve(PROXY + url.href)
    .then(x => fetch(x))
    .then(x => x.text())
    .then(x => parse_html(x))
    .then(x => load_article(ele, url, x))
}

//
//
function parse_html(string) {
    const element = document.createElement("html");
    element.innerHTML = string;
    return element;
}
function load_article(ele, url, html) {
    const domain = url.hostname;
    ele.children[0].remove();
    
    switch (domain) {
        default: return Promise.resolve().then(() => {
            ele.appendChild(document.createElement("h1"));
            ele.children[0].innerHTML = `The domain ${domain} is not supported. Sorry!`;
        });
    }
}
