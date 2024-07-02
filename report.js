const printReport = (pages) => {
	console.log('report is starting...');
	for (const [url, count] of Object.entries(pages)) {
		console.log(`Found ${count} internal links to ${url}`);
	}
}

export { printReport };
