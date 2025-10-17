let websiteData = [];

function displayCards(data) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="text-align: center; width: 100%; color: #888;">抱歉，没有找到匹配的网站。</p>';
        return;
    }

    data.forEach(website => {
        const card = document.createElement('div');
        card.classList.add('card');

        const descriptionContent = `
            <p class="description">${website.description}</p>
            <button class="copy-btn" data-url="${website.url}">复制链接</button>
        `;
        
        card.innerHTML = `
            <img src="${website.logo}" alt="${website.name} Logo" class="logo" data-url="${website.url}">
            <h3 class="website-name" data-url="${website.url}">${website.name}</h3>
            <p class="type">${website.type}</p>
            ${descriptionContent}
        `;

        const description = card.querySelector('.description');
        const logo = card.querySelector('.logo');
        const websiteName = card.querySelector('.website-name');
        const copyBtn = card.querySelector('.copy-btn');

        description.addEventListener('click', () => {
            description.classList.toggle('expanded');
        });

        [logo, websiteName].forEach(element => {
            element.addEventListener('click', (event) => {
                window.open(event.target.getAttribute('data-url'), '_blank');
            });
        });

        copyBtn.addEventListener('click', (event) => {
            const url = event.target.getAttribute('data-url');
            navigator.clipboard.writeText(url)
                .then(() => {
                    alert('链接已复制！');
                })
                .catch(err => {
                    alert('复制链接失败！');
                    console.error('复制失败:', err);
                });
        });

        container.appendChild(card);
    });
}

function executeSearch(searchTerm) {
    const lowerCaseSearchTerm = searchTerm.trim().toLowerCase();

    if (lowerCaseSearchTerm === "") {
        displayCards(websiteData);
        return;
    }

    try {
        const regex = new RegExp(lowerCaseSearchTerm, 'i');
        const filteredData = websiteData.filter(website => {
            return regex.test(website.name) || regex.test(website.description);
        });
        displayCards(filteredData);
    } catch (error) {
        console.error("无效的搜索关键字:", error);
        displayCards(websiteData);
        alert("搜索关键字格式错误，请检查后重试！");
    }
}

function handleSearch() {
    const searchBox = document.getElementById('search-box');
    const query = searchBox.value.trim();

    const baseUrl = window.location.origin + window.location.pathname;
    let newUrl;
    
    if (query === "") {
        newUrl = baseUrl;
    } else {
        newUrl = `${baseUrl}?q=${encodeURIComponent(query)}`;
    }
    
    window.location.href = newUrl;
}


document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('search-box');
    const searchBtn = document.getElementById('search-btn');

    searchBtn.addEventListener('click', handleSearch);

    searchBox.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            websiteData = data;
            
            const urlParams = new URLSearchParams(window.location.search);
            const initialQuery = urlParams.get('q');
            
            if (initialQuery) {
                searchBox.value = initialQuery;
                executeSearch(initialQuery);
            } else {
                displayCards(websiteData);
            }
        })
        .catch(error => {
            console.error('获取 JSON 数据失败:', error);
            document.getElementById('card-container').innerHTML = '<p style="text-align: center; width: 100%; color: red;">加载网站数据失败。</p>';
        });
});
