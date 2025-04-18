const blockList = [
    "msn.com",
    "internethaber.com",
    "fotomac.com.tr",
    "tgrthaber.com.tr",
    "aksam.com.tr",
    "trthaber.com",
    "star.com.tr",
    "ahaber.com.tr",
    "sporx.com",
    "gazetevatan.com",
    "sozcu.com.tr",
    "haberturk.com",
    "mynet.com",
    "acunn.com",
    "haber7.com",
    "sabah.com.tr",
    "yenisafak.com",
    "hurriyet.com.tr",
    "cnnturk.com",
    "youtube.com",
    "pinterest.com",
    "milliyet.com.tr",
    "haberler.com",
    "posta.com.tr",
    "fanatik.com.tr",
    "cumhuriyet.com.tr",
    "takvim.com.tr",
    "ensonhaber.com",
    "sondakika.com",
    "t24.com.tr",
    "ntv.com.tr"
];

function getDomain(url) {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname;
        const parts = hostname.split('.');

        // Handle domains like www.msn.com => msn.com or news.msn.com => msn.com
        if (parts.length > 2) {
            return parts.slice(-2).join('.');
        } else {
            return hostname;
        }
    } catch (e) {
        return "";
    }
}

function filterResults() {
    const results = document.querySelectorAll('div.g, div.MjjYud'); // support classic & new UI

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

filterResults();

const observer = new MutationObserver(filterResults);
observer.observe(document.body, { childList: true, subtree: true });
