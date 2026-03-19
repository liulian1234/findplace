window.addEventListener('DOMContentLoaded', () => {
    async function loadTasks() {
        const voynichList = document.getElementById('voynich-list');
        if (!voynichList) return;
        voynichList.innerHTML = ''; 

        // 扫描 f1v 到 f150v
        const ids = [];
        for(let i=1; i<=150; i++) ids.push(`f${i}v`);

        let found = false;

        for (const id of ids) {
            try {
                // 使用 /tasks/ 绝对路径，确保 Vercel 能准确定位
                const res = await fetch(`/tasks/${id}.json?t=${new Date().getTime()}`); // 加个时间戳防止缓存
                if (!res.ok) continue;
                
                const data = await res.json();
                found = true;

                // 确保图片路径也是绝对路径
                let imgPath = data.img.startsWith('/') ? data.img : '/' + data.img;

                const card = `
                    <div class="card">
                        <img src="${imgPath}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片同步中'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag">寻找中</span></h3>
                            <p class="desc">${data.desc}</p>
                            <div class="price">赏金：${data.price}</div>
                            <a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>
                        </div>
                    </div>`;
                voynichList.insertAdjacentHTML('beforeend', card);
            } catch (e) { }
        }

        if(!found) {
            voynichList.innerHTML = '<p style="color:gray;text-align:center;width:100%;">📡 暂无任务，请确认 GitHub 的 /tasks/ 文件夹下已有 JSON 文件。</p>';
        }
    }

    loadTasks();
});

// 其余 switchCat 和 view 函数保持不变...
