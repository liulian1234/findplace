window.addEventListener('DOMContentLoaded', () => {
    // 1. 自动加载逻辑
    async function loadTasks() {
        const voynichList = document.getElementById('voynich-list');
        voynichList.innerHTML = ''; 

        // 智能扫描范围：扫描 f1v 到 f150v
        // 这样你以后发布任何在这个范围内的编号，网页都会自动出现
        const possibleIds = [];
        for(let i=1; i<=150; i++) possibleIds.push(`f${i}v`);

        let foundCount = 0;

        for (const id of possibleIds) {
            try {
                const res = await fetch(`./tasks/${id}.json`);
                if (!res.ok) continue; // 如果文件不存在，跳过
                
                const data = await res.json();
                foundCount++;

                const card = `
                    <div class="card">
                        <img src="${data.img}" onclick="view(this.src)" onerror="this.src='https://via.placeholder.com/160?text=图片同步中'">
                        <div class="info">
                            <h3>编号：${data.id} <span class="tag">寻找中</span></h3>
                            <p class="desc">${data.desc}</p>
                            <div class="price">${data.price}</div>
                            <a href="https://forms.gle/qACH4MgrUDwHaiyCA" target="_blank" class="btn">📥 提交证据</a>
                        </div>
                    </div>`;
                voynichList.insertAdjacentHTML('beforeend', card);
            } catch (e) { /* 忽略错误 */ }
        }

        if(foundCount === 0) {
            voynichList.innerHTML = '<p style="color:gray;">目前暂无悬赏，请等待馆长更新...</p>';
        }
    }

    // 2. 在线人数波动
    const onlineEl = document.getElementById('online-num');
    function updateOnline() {
        let num = Math.floor(Math.random() * 20) + 40;
        if(onlineEl) onlineEl.innerText = num;
    }
    setInterval(updateOnline, 3000);
    updateOnline();

    // 3. 统计图
    const chartDom = document.getElementById('chart');
    if (chartDom) {
        const myChart = echarts.init(chartDom);
        myChart.setOption({
            series: [{
                type: 'pie', radius: ['40%', '70%'],
                label: {show: false},
                data: [{value: 5, name: '寻找中', itemStyle:{color:'#d35400'}}, 
                      {value: 2, name: '已完成', itemStyle:{color:'#27ae60'}}]
            }]
        });
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
