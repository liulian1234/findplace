window.addEventListener('DOMContentLoaded', () => {
    console.log("伏尼契系统逻辑启动...");

    // 1. 获取并显示后台任务 (从 tasks 文件夹读取)
    async function fetchTasks() {
        const taskList = document.getElementById('task-list');
        try {
            // 注意：当你在后台发布任务后，Netlify 会生成这些 JSON
            // 如果你还没发布过，这里会报错，是正常的
            const response = await fetch('/tasks/index.json'); 
            const tasks = await response.json();
            
            if (tasks && tasks.length > 0) {
                taskList.innerHTML = ''; // 清除“加载中”
                tasks.forEach(task => {
                    const card = `
                        <div class="card">
                            <img src="${task.img}" alt="任务图片">
                            <div class="info">
                                <h3>编号：${task.id} <span class="tag">寻找中</span></h3>
                                <p class="desc">${task.desc}</p>
                                <div class="price">赏金：${task.price}</div>
                                <button class="btn" onclick="alert('请通过后台提交证据')">📥 提交证据</button>
                            </div>
                        </div>`;
                    taskList.insertAdjacentHTML('beforeend', card);
                });
            } else {
                taskList.innerHTML = '<p>目前暂无悬赏任务，请等待馆长发布。</p>';
            }
        } catch (e) {
            taskList.innerHTML = '<p>等待馆长发布首个任务...</p>';
            console.log("任务库尚为空白");
        }
    }

    // 2. 在线人数波动逻辑
    let onlineNum = 12;
    const onlineEl = document.getElementById('online-num');
    function updateOnline() {
        onlineNum += Math.floor(Math.random() * 5) - 2; // -2 到 +2 波动
        if (onlineNum < 5) onlineNum = 5;
        if (onlineNum > 45) onlineNum = 45;
        if (onlineEl) onlineEl.innerText = onlineNum;
    }
    setInterval(updateOnline, 5000);
    updateOnline();

    // 3. 任务分布统计图 (ECharts)
    const chartDom = document.getElementById('chart');
    if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 10, borderColor: '#f5e6c8', borderWidth: 2 },
                label: { show: false },
                data: [
                    { value: 2, name: '寻找中', itemStyle: {color: '#d35400'} },
                    { value: 0, name: '已结案', itemStyle: {color: '#27ae60'} }
                ]
            }]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    fetchTasks();
});

// 分类切换逻辑
function switchCat(catId, el) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    // 目前简单处理：由于数据是动态的，这里可以扩展过滤逻辑
    console.log("切换到分类：" + catId);
}
