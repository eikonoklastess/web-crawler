import { URL } from "node:url";
import { JSDOM } from "jsdom";

const normalizeURL = (urlString) => {
	const newUrlString = urlString[urlString.length - 1] !== "/"
		? `${urlString}/`
		: urlString;
	const myURL = new URL(newUrlString);
	myURL.protocol = "http";
	if (myURL.href.includes("index.html")) {
		myURL.href = myURL.href.replace("index.html/", "");
	}
	if (myURL.href.includes("default.asp")) {
		myURL.href = myURL.href.replace("default.asp/", "");
	}
	return myURL.href;
};

const getURLsFromHTML = (htmlBody, baseURL) => {
	const dom = new JSDOM(htmlBody);
	const anchors = dom.window.document.querySelectorAll("a");
	let arr = [];
	for (let anchor of anchors) {
		arr.push(relativeURLsToAbsolute(anchor.href, baseURL));
	}
	return arr;
};

const relativeURLsToAbsolute = (relativeURL, baseURL) => {
	const myURL = new URL(baseURL);
	if (relativeURL.split("/")[0].includes("http")) {
		return relativeURL;
	} else if (relativeURL[0] === "/") {
		myURL.pathname = relativeURL;
		return myURL.href;
	}
	const pathName = myURL.pathname;
	const paths = pathName.split("/");
	const newPathName = paths.slice(0, paths.length - 1).join("/") + "/" +
		relativeURL;
	myURL.pathname = newPathName;
	return myURL.href;
};

export { getURLsFromHTML, normalizeURL, relativeURLsToAbsolute };
