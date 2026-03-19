window.addEventListener('DOMContentLoaded', () => {
    async function loadTasks() {
        const categories = ['voynich', 'game', 'crack', 'bounty'];
        categories.forEach(cat => document.getElementById(`${cat}-list`).innerHTML = '');

        const ids = Array.from({length: 150}, (_, i) => `f${i+1}v`);
        let stats = { hunting: 0, completed: 0 };

        for (const id of ids) {
            // 1. 取消掉 f01v (如果编号匹配则跳过)
            if (id === 'f01v') continue;

            try {
                const res = await fetch(`./tasks/${id}.json?t=${Date.now()}`);
                if (!res.ok) continue;
                const data = await res.json();

                const isDone = data.status === "已结案";
                if (isDone) stats.completed++; else stats.hunting++;

                // 2. 已结案显示橙色 (#ff9800)，寻找中显示绿色 (#4caf50)
                const statusColor = isDone ? "#ff9800" : "#4caf50";

                const card = `
                    <div class="card">
                        <img src="${data.img}" onclick="view(this.src)">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag" style="background:${statusColor}">${data.status || '寻找中'}</span></h3>
                            <p>${data.desc}</p>
                            <div class="price">赏金：${data.price}</div>
                        </div>
                    </div>`;

                // 3. 分类分流逻辑 (默认归类到 voynich)
                const targetList = document.getElementById(`${data.category || 'voynich'}-list`);
                if(targetList) targetList.insertAdjacentHTML('beforeend', card);
            } catch (e) {}
        }
        updateChart(stats.hunting, stats.completed);
    }
    loadTasks();
});
