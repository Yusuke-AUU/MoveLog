
window.addEventListener('DOMContentLoaded', function () {
  window.showTab = function (id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'calendar') {
      const y = parseInt(document.getElementById("yearSelect").value);
      const m = parseInt(document.getElementById("monthSelect").value) - 1;
      generateCalendar(y, m);
    }
    if (id === 'graph') renderChart();
  };

  window.renderChart = function () {
    const ctx = document.getElementById('calorieChart')?.getContext('2d');
    const weightCtx = document.getElementById('weightChart')?.getContext('2d');

    if (!ctx || !weightCtx) return;

    let labels = [], intakeData = [], burnedData = [], weightData = [];

    Object.keys(localStorage).sort().forEach(key => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        try {
          const record = JSON.parse(localStorage.getItem(key));
          if (record && record.intake && record.totalBurned && record.weight) {
            labels.push(key);
            intakeData.push(record.intake);
            burnedData.push(record.totalBurned);
            weightData.push(record.weight);
          }
        } catch (e) {
          console.warn(`スキップ: ${key}`);
        }
      }
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: '摂取カロリー', data: intakeData, borderWidth: 2, borderColor: '#0af' },
          { label: '合計消費カロリー', data: burnedData, borderWidth: 2, borderColor: '#fa0' },
          { label: '体重 (kg)', data: weightData, borderWidth: 2, borderColor: '#fff' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: 'white' } } },
        scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } }
      }
    });

    new Chart(weightCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: '体重 (kg)', data: weightData, borderWidth: 2, borderColor: '#fff', tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: 'white' } } },
        scales: { x: { ticks: { color: 'white' } }, y: { ticks: { color: 'white' } } }
      }
    });
  };

  window.populateYearMonthSelectors = function () {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    if (!yearSelect || !monthSelect) return;
    for (let y = 2020; y <= 2060; y++) {
      let opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }
    for (let m = 1; m <= 12; m++) {
      let opt = document.createElement('option');
      opt.value = m;
      opt.textContent = `${m}月`;
      monthSelect.appendChild(opt);
    }
    const now = new Date();
    yearSelect.value = now.getFullYear();
    monthSelect.value = now.getMonth() + 1;
  };

  populateYearMonthSelectors();
});
