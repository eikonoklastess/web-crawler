import { expect, test } from "@jest/globals";
import {
	getURLsFromHTML,
	normalizeURL,
	relativeURLsToAbsolute,
} from "./crawl.js";

//Normalization that preserve semantics
// test('Converting persent-encoded triplets to uppercase', () => {
//   expect(normalizeURL('http://example.com/foo%2a/')).toBe('http://example.com/foo%2A/');
// });

test("Converting the scheme to lowercase", () => {
	expect(normalizeURL("HTTP://example.com/Foo/")).toBe(
		"http://example.com/Foo/",
	);
});

test("Converting the host to lowercase", () => {
	expect(normalizeURL("http://example.COM/Foo/")).toBe(
		"http://example.com/Foo/",
	);
});

// Applying RFC 3986 remove_dot_segments algorithm
test("Removing dot-segments", () => {
	expect(normalizeURL("http://example.com/foo/./bar/baz/../qux")).toBe(
		"http://example.com/foo/bar/qux/",
	);
});

// In presence of authority component
test('Converting an empty path to a "/" path', () => {
	expect(normalizeURL("http://boot.dev")).toBe("http://boot.dev/");
});

test("Removing default port", () => {
	expect(normalizeURL("http://example.com:80/")).toBe(
		"http://example.com/",
	);
});

// Normalization the usually preserve semantics
test('Adding a trailling "/" to a non-empty path', () => {
	expect(normalizeURL("http://example.com/foo")).toBe(
		"http://example.com/foo/",
	);
});

// Normalization that change semantic but usually refers to the same ressources
test("Removing directory index", () => {
	expect(normalizeURL("http://example.com/a/index.html")).toBe(
		"http://example.com/a/",
	);
});
test("Removing directory index bis", () => {
	expect(normalizeURL("http://example.com/default.asp")).toBe(
		"http://example.com/",
	);
});

test("Limiting protocols", () => {
	expect(normalizeURL("https://example.com/")).toBe(
		"http://example.com/",
	);
});

// tests for relative url to absolute url
const absURL = "https://www.example.com/path/to/page.html";

test("Relative to the same directory", () => {
	expect(relativeURLsToAbsolute("another-page.html", absURL)).toBe(
		"https://www.example.com/path/to/another-page.html",
	);
});

test("Relative to a subdirectory", () => {
	expect(relativeURLsToAbsolute("subdirectory/page.html", absURL)).toBe(
		"https://www.example.com/path/to/subdirectory/page.html",
	);
});

test("Relative to a parent directory", () => {
	expect(relativeURLsToAbsolute("../up-one-level.html", absURL)).toBe(
		"https://www.example.com/path/up-one-level.html",
	);
});

test("Relative to the root directory", () => {
	expect(relativeURLsToAbsolute("/absolute-root-path.html", absURL)).toBe(
		"https://www.example.com/absolute-root-path.html",
	);
});

test("Relative with a query", () => {
	expect(relativeURLsToAbsolute("another-page.html?query=123", absURL))
		.toBe(
			"https://www.example.com/path/to/another-page.html%3Fquery=123",
		);
});

test("relative with a fragment identifier", () => {
	expect(relativeURLsToAbsolute("another-page.html#section2", absURL))
		.toBe(
			"https://www.example.com/path/to/another-page.html%23section2",
		);
});

// test for get url from html
const HTML1 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Links</title>
</head>
<body>
    <a href="https://www.example.com">Example</a>
    <a href="https://www.google.com">Google</a>
    <a href="https://www.github.com">GitHub</a>
</body>
</html>`;

const HTML2 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mock HTML Page with Various Relative Paths</title>
</head>
<body>
    <h1>Welcome to Our Mock Server</h1>
    <nav>
        <ul>
            <li><a href="/home">Home</a> (Absolute Path)</li>
            <li><a href="./services">Services</a> (Relative Path with)</li>
            <li><a href="../contact">Contact</a> (Relative to Parent Directory)</li>
            <li><a href="faq.html">FAQ</a> (Relative Path with File)</li>
        </ul>
    </nav>
    <footer>
        <p>&copy; 2024 Mock Server Inc. All rights reserved.</p>
    </footer>
</body>
</html>`;

//const absURL = "https://www.example.com/path/to/page.html";
test("find all links absolute", () => {
	expect(getURLsFromHTML(HTML1, absURL)).toStrictEqual([
		"https://www.example.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	]);
});

test("find all links relative", () => {
	expect(getURLsFromHTML(HTML2, absURL)).toStrictEqual([
		"https://www.example.com/home",
		"https://www.example.com/path/to/services",
		"https://www.example.com/path/contact",
		"https://www.example.com/path/to/faq.html",
	]);
});
