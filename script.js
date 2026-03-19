window.addEventListener('DOMContentLoaded', () => {
    const voynichList = document.getElementById('voynich-list');
    
    async function loadTasks() {
        voynichList.innerHTML = '<p style="color:orange;">🔍 正在深度扫描任务库...</p>';
        
        // 扫描范围 f1v - f150v
        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let foundAny = false;

        for (const id of ids) {
            try {
                // 添加时间戳 t=... 防止浏览器缓存旧结果
                const response = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                
                if (response.ok) {
                    const data = await response.json();
                    foundAny = true;
                    
                    // 确保图片路径前面有斜杠
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
                    // 第一次发现任务时清空“扫描中”提示
                    if (foundAny && voynichList.querySelector('.loading')) voynichList.innerHTML = '';
                    
                    voynichList.insertAdjacentHTML('beforeend', card);
                }
            } catch (err) {
                console.error(`尝试加载 ${id} 失败:`, err);
            }
        }

        if (!foundAny) {
            voynichList.innerHTML = `
                <div style="text-align:center; padding:20px;">
                    <p style="color:#d35400;">⚠️ 未发现已发布的任务文件</p>
                    <p style="font-size:12px; color:gray;">请检查 GitHub 仓库 /tasks/ 目录下是否存在 .json 文件</p>
                </div>`;
        }
    }

    loadTasks();
});

// 分类切换和预览函数保持不变...
