/**
 * 伏尼契赏金大厅 - 核心逻辑
 */

// 1. 分类切换逻辑
function switchCat(catId, el) {
    // 切换导航高亮
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    
    // 切换内容区域
    document.querySelectorAll('.category-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(catId).classList.add('active');
    
    // 手机端自动回顶
    if(window.innerWidth < 850) {
        window.scrollTo({ top: document.getElementById('main').offsetTop - 60, behavior: 'smooth' });
    }
}

// 2. 图片查看逻辑
function view(src) {
    const viewer = document.getElementById('viewer');
    const vImg = document.getElementById('viewer-img');
    vImg.src = src;
    viewer.style.display = 'flex';
}

// 3. 智能在线人数逻辑 (呼吸感)
let onlineCount = 12;

function refreshOnline() {
    const chance = Math.random();
    if (chance < 0.4) {
        onlineCount += Math.floor(Math.random() * 3) + 1; // 增加 1-3 人
    } else if (chance < 0.7) {
        onlineCount -= Math.floor(Math.random() * 2) + 1; // 减少 1-2 人
    }
    
    // 范围锁定在 1 - 30 人
    if (onlineCount < 1) onlineCount = 1;
    if (onlineCount > 30) onlineCount = 30;
    
    const el = document.getElementById('online-num');
    if (el) el.innerText = onlineCount;
}

// 每 7 秒模拟一次人流变化
setInterval(refreshOnline, 7000);
refreshOnline();

// 4. ECharts 任务状态分布图
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
                { value: 2, name: '寻找中', itemStyle:{color:'#d35400'} },
                { value: 0, name: '已成功结案', itemStyle:{color:'#27ae60'} }
            ]
        }]
    };
    myChart.setOption(option);
    window.addEventListener('resize', () => myChart.resize());
}
