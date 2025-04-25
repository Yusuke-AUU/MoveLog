
window.addEventListener('DOMContentLoaded', function() {
  // タブ切り替え
  window.showTab = function(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'calendar') generateCalendar();
    if (id === 'graph') renderChart();
  };

  // トレーニング追加機能
  document.getElementById('addTraining').addEventListener('click', function () {
    const container = document.getElementById('trainingContainer');
    const div = document.createElement('div');
    div.innerHTML = '<input type="text" class="activity" placeholder="種目"> <input type="number" class="calories" placeholder="消費カロリー(kcal)">';
    container.appendChild(div);
  });

  // 記録保存
  document.getElementById('recordForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const intake = parseFloat(document.getElementById('intake').value);
    let totalCalories = 0;
    let activities = '';

    document.querySelectorAll('#trainingContainer div').forEach(div => {
      const act = div.querySelector('.activity').value;
      const cal = parseFloat(div.querySelector('.calories').value || 0);
      totalCalories += cal;
      activities += act + ' ';
    });

    const metabolism = 2000;
    const totalBurned = totalCalories + metabolism;
    const balance = intake - totalBurned;
    const theoryLoss = Math.round((balance / 700 * 0.1) * 100) / 100;

    const record = { date, weight, intake, totalCalories, metabolism, totalBurned, balance, theoryLoss, activities };
    localStorage.setItem(date, JSON.stringify(record));
    updateSummary(record);
  });

  function updateSummary(record) {
    document.getElementById('summaryText').innerHTML = `
      📅 日付: ${record.date}<br>
      ⚖️ 体重: ${record.weight}kg<br>
      🍙 摂取: ${record.intake} kcal<br>
      🔋 基礎代謝: ${record.metabolism} kcal<br>
      🔥 運動消費: ${record.totalCalories} kcal<br>
      💓 合計消費（含：基礎代謝）: ${record.totalBurned} kcal<br>
      ⚖️ カロリー差分: ${record.balance} kcal<br>
      📉 理論増減値: ${record.theoryLoss >= 0 ? '+' : ''}${record.theoryLoss} kg
    `;
  }

  // カレンダー生成
  window.generateCalendar = function() {
    const container = document.getElementById('calendarContainer');
    container.innerHTML = '';
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const endDate = new Date(year, month + 1, 0).getDate();

    container.className = "calendar";

    for (let i = 1; i <= endDate; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayDiv = document.createElement('div');
      dayDiv.className = "calendar-day";
      const record = JSON.parse(localStorage.getItem(dateStr));
      if (record) {
        dayDiv.innerHTML = `📅${i}<br>⚖️${record.weight}kg<br>${record.activities}<br>📉${record.theoryLoss}kg`;
      } else {
        dayDiv.innerHTML = `📅${i}`;
      }
      container.appendChild(dayDiv);
    }
  };

  // グラフ描画
  window.renderChart = function() {
    const ctx = document.getElementById('calorieChart').getContext('2d');
    let labels = [], intakeData = [], burnedData = [], weightData = [];

    Object.keys(localStorage).sort().forEach(key => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        const record = JSON.parse(localStorage.getItem(key));
        labels.push(key);
        intakeData.push(record.intake);
        burnedData.push(record.totalBurned);
        weightData.push(record.weight);
      }
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: '摂取カロリー', data: intakeData, borderWidth: 2 },
          { label: '合計消費カロリー', data: burnedData, borderWidth: 2 },
          { label: '体重 (kg)', data: weightData, borderWidth: 2 }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'white' } }
        },
        scales: {
          x: { ticks: { color: 'white' } },
          y: { ticks: { color: 'white' } }
        }
      }
    });
  };

  showTab('record');
});
