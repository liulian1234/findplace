window.addEventListener('DOMContentLoaded', () => {
    const onlineEl = document.getElementById('online-num');
    
    async function loadTasks() {
        // 1. 清理所有容器
        const categoryLists = ['voynich-list', 'game-list', 'crack-list', 'progress-list', 'bounty-list'];
        categoryLists.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.innerHTML = '';
        });

        // 2. 遍历加载 (1-150号)
        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        for (const id of ids) {
            try {
                const res = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                if (!res.ok) continue;
                const data = await res.json();

                const isDone = data.status === "已结案";
                if (isDone) stats.completed++; else stats.hunting++;

                // 3. 自动分流逻辑：已结案的全部进入 bounty-list，否则进入原分类
                const targetListId = isDone ? 'bounty-list' : `${data.category || 'voynich'}-list`;
                const tagColor = isDone ? "#7f8c8d" : "#27ae60";

                const card = `
                    <div class="card" style="${isDone ? 'opacity: 0.85; border-left: 5px solid #7f8c8d;' : ''}">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片加载中'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag" style="background:${tagColor}">${data.status || '寻找中'}</span></h3>
                            <p>${data.desc}</p>
                            <div class="price">${isDone ? '<span style="color:#7f8c8d">💰 赏金已发放</span>' : '赏金：' + data.price}</div>
                            ${isDone ? '<div class="done-stamp">SEALED / 已封卷</div>' : `<a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>`}
                        </div>
                    </div>`;

                const listContainer = document.getElementById(targetListId);
                if (listContainer) listContainer.insertAdjacentHTML('beforeend', card);
            } catch (e) {}
        }
        updateChart(stats.hunting, stats.completed);
    }

    function updateChart(h, c) {
        const dom = document.getElementById('chart');
        if (!dom) return;
        const myChart = echarts.init(dom);
        myChart.setOption({
            series: [{
                type: 'pie', radius: ['40%', '70%'],
                data: [
                    { value: h, name: '寻找中', itemStyle: { color: '#27ae60' } },
                    { value: c, name: '已结案', itemStyle: { color: '#7f8c8d' } }
                ],
                label: { show: false }
            }]
        });
    }

    setInterval(() => { if(onlineEl) onlineEl.innerText = Math.floor(Math.random()*15)+40; }, 4000);
    loadTasks();
});

function switchCat(id, el) {
    document.querySelectorAll('.category-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}
function view(s){ document.getElementById('viewer-img').src=s; document.getElementById('viewer').style.display='flex'; }
