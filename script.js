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
