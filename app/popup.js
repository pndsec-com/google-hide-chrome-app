const domainInput = document.getElementById('domainInput');
const addBtn = document.getElementById('addBtn');
const domainListEl = document.getElementById('domainList');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

function refreshList(blockList) {
    domainListEl.innerHTML = '';
    blockList.forEach(domain => {
        const li = document.createElement('li');
        li.textContent = domain;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '10px';
        removeBtn.style.background = '#e74c3c';
        removeBtn.style.color = '#fff';
        removeBtn.style.border = 'none';
        removeBtn.style.padding = '2px 6px';
        removeBtn.style.borderRadius = '4px';
        removeBtn.style.cursor = 'pointer';
        
        removeBtn.onclick = () => {
            const updatedList = blockList.filter(d => d !== domain);
            chrome.storage.sync.set({ blockList: updatedList }, () => refreshList(updatedList));
        };

        li.appendChild(removeBtn);
        domainListEl.appendChild(li);
    });
}

chrome.storage.sync.get(['blockList'], (data) => {
    refreshList(data.blockList || []);
});

addBtn.onclick = () => {
    const domain = domainInput.value.trim();
    if (!domain) return;
    chrome.storage.sync.get(['blockList'], (data) => {
        const blockList = data.blockList || [];
        if (!blockList.includes(domain)) {
            blockList.push(domain);
            chrome.storage.sync.set({ blockList }, () => {
                domainInput.value = '';
                refreshList(blockList);
            });
        }
    });
};

exportBtn.onclick = () => {
    chrome.storage.sync.get(['blockList'], (data) => {
        const blob = new Blob([JSON.stringify(data.blockList || [], null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'blocklist.json';
        a.click();
    });
};

importFile.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const list = JSON.parse(reader.result);
            if (Array.isArray(list)) {
                chrome.storage.sync.set({ blockList: list }, () => refreshList(list));
            }
        } catch (e) {
            alert("Invalid JSON file.");
        }
    };
    reader.readAsText(file);
};
