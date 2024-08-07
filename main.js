import { crawlPage } from './crawl.js';
import { printReport } from './report.js';
import { emitWarning, argv } from 'node:process';
import { URL } from 'node:url';

const args = argv;

const main = async (urlString) => {
	const pages = await crawlPage(urlString);
	printReport(pages);
}

const isValidURL = (urlString) => {
	try {
		const url = new URL(urlString);
		return url.protocol === 'https' || url.protocol === 'https';
	} catch (err) {
		return false;
	}
}

if (args.length > 3) {
	emitWarning('too many arguments', {});
} else if (args.length < 3) {
	emitWarning('not enough argments', {});
}
else if (isValidURL(args[0])) {
	emitWarning('not a valid url', {});
}

main(args[2])

