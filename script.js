window.addEventListener('DOMContentLoaded', () => {
    // 自动加载任务逻辑
    async function loadTasks() {
        const voynichList = document.getElementById('voynich-list');
        voynichList.innerHTML = ''; 

        // 设定扫描范围 (你可以根据需要调大 150 这个数字)
        const possibleIds = [];
        for(let i=1; i<=150; i++) possibleIds.push(`f${i}v`);

        let foundCount = 0;

        for (const id of possibleIds) {
            try {
                // 尝试从 /tasks/ 文件夹获取 json
                const res = await fetch(`./tasks/${id}.json`);
                if (!res.ok) continue; 
                
                const data = await res.json();
                foundCount++;

                const card = `
                    <div class="card">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片同步中'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag">寻找中</span></h3>
                            <p class="desc">${data.desc}</p>
                            <div class="price">赏金：${data.price}</div>
                            <a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>
                        </div>
                    </div>`;
                voynichList.insertAdjacentHTML('beforeend', card);
            } catch (e) { /* 跳过不存在的任务 */ }
        }

        if(foundCount === 0) {
            voynichList.innerHTML = '<p style="color:gray;text-align:center;width:100%;">📡 暂无活跃悬赏，馆长正在整理手稿...</p>';
        }
    }

    // 在线人数随机波动 (增强真实感)
    const onlineEl = document.getElementById('online-num');
    function updateOnline() {
        let num = Math.floor(Math.random() * 20) + 40;
        if(onlineEl) onlineEl.innerText = num;
    }
    setInterval(updateOnline, 5000);
    updateOnline();

    loadTasks();
});

// 分类切换逻辑
function switchCat(catId, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(catId).classList.add('active');
    el.classList.add('active');
}

// 图片预览查看器
function view(src) {
    const v = document.getElementById('viewer');
    document.getElementById('viewer-img').src = src;
    v.style.display = 'flex';
}
