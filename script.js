
window.addEventListener('DOMContentLoaded', function () {
  window.showTab = function (id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    if (id === 'calendar') generateCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
    if (id === 'graph') renderChart();
  };

  document.getElementById('addTraining').addEventListener('click', function () {
  const container = document.getElementById('trainingContainer');
  const div = document.createElement('div');
  div.classList.add('training-row');
  div.innerHTML = `
    <select class="activity">
      <option value="swim">🏊‍♂️ スイム</option>
      <option value="bike">🚴‍♂️ バイク</option>
      <option value="run">🏃‍♂️ ラン</option>
      <option value="trampoline">🪽 トランポリン</option>
      <option value="ballet">🩰 バレエ</option>
      <option value="workout">💪 筋トレ</option>
    </select>
    <input type="number" class="minutes" placeholder="分数">
    <input type="number" class="distance" placeholder="距離 (km)" step="0.1">
    <button type="button" class="delete-training">🗑️</button>
  `;
  container.appendChild(div);

  div.querySelector('.delete-training').addEventListener('click', () => div.remove());
});

  
document.getElementById('recordForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const intake = parseInt(document.getElementById('intake').value);
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const key = `MoveLog_${year}_${month}`;

  const trainings = Array.from(document.querySelectorAll('.training-row')).map(row => ({
    activity: row.querySelector('.activity').value,
    minutes: parseInt(row.querySelector('.minutes').value),
    distance: parseFloat(row.querySelector('.distance')?.value || 0)
  }));

  const record = { date, weight, intake, trainings };
  let data = JSON.parse(localStorage.getItem(key) || "[]");
  const index = data.findIndex(r => r.date === date);
  if (index > -1) data[index] = record;
  else data.push(record);
  localStorage.setItem(key, JSON.stringify(data));

  alert("記録を保存しました！");
});


  function updateSummary(record) {
    document.getElementById('summaryText').innerHTML = `
      📅 日付: ${record.date}<br>
      ⚖️ 体重: ${record.weight}kg<br>
      🍙 摂取: ${record.intake} kcal<br>
      🔋 基礎代謝: ${record.metabolism} kcal<br>
      🔥 運動消費: ${Math.round(record.totalCalories)} kcal<br>
      💓 合計消費（含：基礎代謝）: ${Math.round(record.totalBurned)} kcal<br>
      ⚖️ カロリー差分: ${Math.round(record.balance)} kcal<br>
      📉 理論増減値: ${record.theoryLoss >= 0 ? '+' : ''}${record.theoryLoss} kg
    `;
  }

  window.generateCalendar = function () {
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
        dayDiv.innerHTML = `${i}日\n⚖️${record.weight}kg\n${record.activities.trim()}\n📉${record.theoryLoss}kg`;
      } else {
        dayDiv.innerHTML = `${i}日`;
      }
      container.appendChild(dayDiv);
    }
  };

  window.renderChart = function () {
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
          { label: '摂取カロリー', data: intakeData, borderWidth: 2, borderColor: '#0af' },
          { label: '合計消費カロリー', data: burnedData, borderWidth: 2, borderColor: '#fa0' },
          { label: '体重 (kg)', data: weightData, borderWidth: 2, borderColor: '#fff' }
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

// 年月セレクタ初期化
window.populateYearMonthSelectors = function() {
  const yearSelect = document.getElementById('yearSelect');
  const monthSelect = document.getElementById('monthSelect');
  if (!yearSelect || !monthSelect) return;

  for (let y = 2025; y <= 2065; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  for (let m = 0; m < 12; m++) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = (m + 1) + '月';
    monthSelect.appendChild(opt);
  }

  const now = new Date();
  yearSelect.value = now.getFullYear();
  monthSelect.value = now.getMonth();


};

populateYearMonthSelectors();

document.getElementById("showCalendarButton").addEventListener("click", () => {
  const y = parseInt(document.getElementById("yearSelect").value);
  const m = parseInt(document.getElementById("monthSelect").value);
  generateCalendar(y, m);
});
