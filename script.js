window.addEventListener('DOMContentLoaded', () => {
    const voynichList = document.getElementById('voynich-list');
    if (!voynichList) return;

    async function loadTasks() {
        voynichList.innerHTML = '<p style="color:orange; text-align:center; width:100%;">🔍 正在调取大厅档案...</p>';
        
        // 生成扫描编号：同时支持 f1v 和 f01v 格式
        const ids = [];
        for (let i = 1; i <= 150; i++) {
            ids.push(`f${i}v`);
            if (i < 10) ids.push(`f0${i}v`); 
        }

        let foundAny = false;

        for (const id of ids) {
            try {
                // t=${Date.now()} 确保每次都是最新的，不读旧缓存
                const response = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                
                if (response.ok) {
                    const data = await response.json();
                    if (!foundAny) voynichList.innerHTML = ''; // 发现第一个任务时清空提示
                    foundAny = true;
                    
                    // 自动修正图片路径
                    const imgPath = data.img.startsWith('/') ? data.img : '/' + data.img;

                    const card = `
                        <div class="card">
                            <img src="${imgPath}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片加载中'">
                            <div class="info">
                                <h3>编号：${data.id} <span class="tag">寻找中</span></h3>
                                <p class="desc">${data.desc}</p>
                                <div class="price">赏金：${data.price}</div>
                                <a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>
                            </div>
                        </div>`;
                    
                    voynichList.insertAdjacentHTML('beforeend', card);
                }
            } catch (err) { }
        }

        if (!foundAny) {
            voynichList.innerHTML = `
                <div style="text-align:center; padding:20px; width:100%;">
                    <p style="color:#d35400;">⚠️ 档案库暂无匹配任务</p>
                    <p style="font-size:12px; color:gray;">请检查 GitHub /tasks/ 目录下是否有有效的 .json 文件</p>
                </div>`;
        }
    }

    loadTasks();
});

// 分类切换
function switchCat(catId, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(catId).classList.add('active');
    el.classList.add('active');
}

// 图片预览
function view(src) {
    const v = document.getElementById('viewer');
    document.getElementById('viewer-img').src = src;
    v.style.display = 'flex';
}
