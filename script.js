window.addEventListener('DOMContentLoaded', () => {
    console.log("伏尼契系统逻辑启动...");

    // 1. 获取并显示后台任务
    async function fetchTasks() {
        const taskList = document.getElementById('task-list');
        // 【关键修改】：在这里列出你用 Python 上传的任务编号
        // 以后你每增加一个任务（比如 f106v），就往这个括号里加一个名字
        const myTasks = ['f9v', 'f33v', 'f105v']; 

        taskList.innerHTML = ''; // 清除“加载中”

        let hasTask = false;

        for (const id of myTasks) {
            try {
                // 尝试读取每一个 JSON 文件
                const response = await fetch(`/tasks/${id}.json`);
                if (!response.ok) continue;
                
                const task = await response.json();
                hasTask = true;

                const card = `
                    <div class="card">
                        <img src="${task.img}" alt="任务图片">
                        <div class="info">
                            <h3>编号：${task.id} <span class="tag">寻找中</span></h3>
                            <p class="desc">${task.desc}</p>
                            <div class="price">赏金：${task.price}</div>
                            <button class="btn" onclick="alert('请联系馆长提交证据')">📥 提交证据</button>
                        </div>
                    </div>`;
                taskList.insertAdjacentHTML('beforeend', card);
            } catch (e) {
                console.log(`任务 ${id} 尚未发布或路径错误`);
            }
        }

        if (!hasTask) {
            taskList.innerHTML = '<p>等待馆长通过 Python 发布首个任务...</p>';
        }
    }

    // 2. 在线人数波动逻辑 (保持不变)
    let onlineNum = 12;
    const onlineEl = document.getElementById('online-num');
    function updateOnline() {
        onlineNum += Math.floor(Math.random() * 5) - 2;
        if (onlineNum < 5) onlineNum = 5;
        if (onlineNum > 45) onlineNum = 45;
        if (onlineEl) onlineEl.innerText = onlineNum;
    }
    setInterval(updateOnline, 5000);
    updateOnline();

    // 3. 统计图逻辑 (保持不变)
    const chartDom = document.getElementById('chart');
    if (chartDom) {
        const myChart = echarts.init(chartDom);
        myChart.setOption({
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                itemStyle: { borderRadius: 10, borderColor: '#f5e6c8', borderWidth: 2 },
                label: { show: false },
                data: [
                    { value: myTasks.length, name: '寻找中', itemStyle: {color: '#d35400'} },
                    { value: 0, name: '已结案', itemStyle: {color: '#27ae60'} }
                ]
            }]
        });
        window.addEventListener('resize', () => myChart.resize());
    }

    fetchTasks();
});

function switchCat(catId, el) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
}
