let websiteData = []; // 用于存储所有网站的数据

// 使用 Fetch API 获取 JSON 数据
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        websiteData = data;  // 保存原始数据
        displayCards(websiteData);  // 初始显示所有卡片
    })
    .catch(error => console.error('获取 JSON 数据失败:', error));

// 动态显示卡片
function displayCards(data) {
    const container = document.getElementById('card-container');
    container.innerHTML = '';  // 清空现有的卡片

    data.forEach(website => {
        const card = document.createElement('div');
        card.classList.add('card');

        // 创建卡片内容
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

        // 获取描述、logo、网站名称和复制按钮元素
        const description = card.querySelector('.description');
        const logo = card.querySelector('.logo');
        const websiteName = card.querySelector('.website-name');
        const copyBtn = card.querySelector('.copy-btn');

        // 点击描述文字时展开或收起
        description.addEventListener('click', () => {
            description.classList.toggle('expanded');
        });

        // 点击 logo 或网站名称时跳转到网站
        [logo, websiteName].forEach(element => {
            element.addEventListener('click', (event) => {
                window.open(event.target.getAttribute('data-url'), '_blank');
            });
        });

        // 复制链接功能
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

// 搜索功能
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();  // 获取搜索框中的内容并转换为小写
    const filteredData = websiteData.filter(website => {
        const regex = new RegExp(searchTerm, 'i');  // 正则表达式，'i' 忽略大小写
        return regex.test(website.name) || regex.test(website.description);  // 匹配 name 或 description
    });
    displayCards(filteredData);  // 显示匹配的卡片
});
