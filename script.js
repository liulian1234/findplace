/**
 * 伏尼契赏金大厅 - 核心逻辑控制 (最新版)
 */

window.addEventListener('DOMContentLoaded', () => {
    console.log("赏金大厅逻辑已激活...");

    // 1. 初始化在线人数 (初始设为15)
    let currentOnline = 15;
    const onlineEl = document.getElementById('online-num');

    function updateOnlineStatus() {
        const decision = Math.random();
        if (decision < 0.4) {
            currentOnline += Math.floor(Math.random() * 3) + 1; // 增加1-3人
        } else if (decision < 0.7) {
            currentOnline -= Math.floor(Math.random() * 2) + 1; // 减少1-2人
        }
        
        // 限制范围：最低1人，最高30人
        if (currentOnline < 1) currentOnline = 1;
        if (currentOnline > 30) currentOnline = 30;

        if (onlineEl) onlineEl.innerText = currentOnline;
    }

    // 每 6 秒波动一次人数
    setInterval(updateOnlineStatus, 6000);
    updateOnlineStatus(); // 立即执行一次


    // 2. 初始化 ECharts 饼图 (任务统计)
    const chartDom = document.getElementById('chart');
    if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item', formatter: '{b}: {c}个 ({d}%)' },
            series: [{
                name: '任务状态',
                type: 'pie',
                radius: ['45%', '75%'],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
                label: { show: true, position: 'outside', fontSize: 11 },
                data: [
                    { value: 2, name: '寻找中', itemStyle: { color: '#d35400' } },
                    { value: 0, name: '成功结案', itemStyle: { color: '#27ae60' } }
                ]
            }]
        };
        myChart.setOption(option);
        // 窗口缩放时图表自适应
        window.addEventListener('resize', () => myChart.resize());
    }
});

// 3. 分类切换函数 (放在全局以便 HTML 调用)
function switchCat(catId, el) {
    // 移除所有导航的高亮
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    // 给当前点击的加高亮
    el.classList.add('active');
    
    // 隐藏所有板块，显示目标板块
    document.querySelectorAll('.category-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(catId).classList.add('active');
    
    // 手机端自动回顶到内容区
    if (window.innerWidth < 850) {
        window.scrollTo({ top: document.getElementById('main').offsetTop - 60, behavior: 'smooth' });
    }
}

// 4. 图片放大功能
function view(src) {
    const viewer = document.getElementById('viewer');
    const viewerImg = document.getElementById('viewer-img');
    if (viewer && viewerImg) {
        viewerImg.src = src;
        viewer.style.display = 'flex';
    }
}
