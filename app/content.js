function getDomain(url) {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        const parts = hostname.split('.');
        return parts.slice(-2).join('.');
    } catch (e) {
        return "";
    }
}

function filterResults(blockList) {
    const results = document.querySelectorAll('div.g, div.MjjYud');

    results.forEach(result => {
        const link = result.querySelector('a');
        if (link) {
            const domain = getDomain(link.href);
            if (blockList.includes(domain)) {
                result.style.display = 'none';
            }
        }
    });
}

function initFilter() {
    chrome.storage.sync.get(['blockList'], (data) => {
        const blockList = data.blockList || [];
        filterResults(blockList);
        const observer = new MutationObserver(() => filterResults(blockList));
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

initFilter();
