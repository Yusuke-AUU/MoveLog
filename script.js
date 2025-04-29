
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
      <option value="off">🚫 OFF</option>
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
    const intake = parseFloat(document.getElementById('intake').value);
    let totalCalories = 0;
    let trainings = [];
    let activities = '';

    document.querySelectorAll('#trainingContainer div').forEach(div => {
      const act = div.querySelector('.activity').value;
      const minutes = parseFloat(div.querySelector('.minutes').value || 0);
      const distance = parseFloat(div.querySelector('.distance').value || 0);
      let cal = 0;

      if (act === 'swim') {
        cal = (distance / 3) * 850 * (minutes / 50);
        activities += '🏊‍♂️ ';
      } else if (act === 'bike') {
        cal = (distance / 30) * 850;
        activities += '🚴‍♂️ ';
      } else if (act === 'run') {
        cal = (distance / 10) * 850 * (minutes / 60);
        activities += '🏃‍♂️ ';
      } else if (act === 'trampoline') {
        cal = (minutes / 60) * 450;
        activities += '🪽 ';
      } else if (act === 'ballet') {
        cal = (minutes / 60) * 450;
        activities += '🩰 ';
      } else if (act === 'workout') {
        cal = (minutes / 30) * 400;
        activities += '💪 ';
      }

      totalCalories += cal;

      trainings.push({
        type: act,
        minutes,
        distance,
        calories: Math.round(cal)
      });

    });

    const metabolism = 2000;
    const totalBurned = totalCalories + metabolism;
    const balance = intake - totalBurned;
    const theoryLoss = Math.round((balance / 700 * 0.1) * 100) / 100;

    const record = { date, weight, intake, totalCalories, metabolism, totalBurned, balance, theoryLoss, activities, trainings };
    localStorage.setItem(date, JSON.stringify(record));
    updateSummary(record);
  });

  function updateSummary(record) {
    
    let trainingDetails = "";
    if (record.trainings && record.trainings.length > 0) {
      trainingDetails = record.trainings.map(t => {
        let icon = {
          swim: "🏊‍♂️",
          bike: "🚴‍♂️",
          run: "🏃‍♂️",
          trampoline: "🪽",
          ballet: "🩰",
          workout: "💪",
          off: "🚫"
        }[t.type] || "";
        let line = `${icon} `;
        if (["swim", "bike", "run"].includes(t.type)) {
          line += `${t.minutes}分, ${t.distance}km, ${t.calories}kcal`;
        } else if (["workout", "ballet", "trampoline", "off"].includes(t.type)) {
          line += `${t.minutes}分, ${t.calories}kcal`;
        }
        return "- " + line;
      }).join("<br>");
    }

    document.getElementById('summaryText').innerHTML = `
      📅 日付: ${record.date}<br>
      ⚖️ 体重: ${record.weight}kg<br>
      🍙 摂取: ${record.intake} kcal<br>
      🔋 基礎代謝: ${record.metabolism} kcal<br>
      🔥 運動消費: ${Math.round(record.totalCalories)} kcal<br>${trainingDetails}<br>
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
      
    dayDiv.dataset.date = dateStr;
    dayDiv.addEventListener('click', () => {
      const record = JSON.parse(localStorage.getItem(dateStr));
      if (record) {
        let html = `📅 ${record.date}<br>
⚖️ 体重: ${record.weight}kg<br>
🍙 摂取: ${record.intake} kcal<br>`;

        if (record.trainings && record.trainings.length > 0) {
          record.trainings.forEach(t => {
            const iconMap = {
              swim: "🏊‍♂️",
              bike: "🚴‍♂️",
              run: "🏃‍♂️",
              trampoline: "🪽",
              ballet: "🩰",
              workout: "💪",
              off: "🚫"
            };
            let line = iconMap[t.type] + " ";
            if (["swim", "bike", "run"].includes(t.type)) {
              line += `${t.minutes}分, ${t.distance}km, ${t.calories}kcal`;
            } else {
              line += `${t.minutes}分, ${t.calories}kcal`;
            }
            html += line + "<br>";
          });
        }

        html += `💓 合計消費: ${Math.round(record.totalBurned)} kcal<br>
⚖️ 差分: ${Math.round(record.balance)} kcal<br>
📉 増減: ${record.theoryLoss >= 0 ? '+' : ''}${record.theoryLoss}kg`;

        document.getElementById("modalContent").innerHTML = html;
        document.getElementById("detailModal").style.display = "flex";
      }
    });

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
    const weightCtx = document.getElementById('weightChart').getContext('2d');
    new Chart(weightCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: '体重 (kg)',
            data: weightData,
            borderWidth: 2,
            borderColor: '#fff',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'white'
            }
          },
          y: {
            ticks: {
              color: 'white'
            }
          }
        }
      }
    });

  };

  showTab('record');


// モーダルHTML追加
const modal = document.createElement("div");
modal.id = "detailModal";
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
modal.style.display = "none";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
modal.style.zIndex = "9999";

const modalContent = document.createElement("div");
modalContent.style.backgroundColor = "#111";
modalContent.style.color = "#fff";
modalContent.style.padding = "20px";
modalContent.style.borderRadius = "10px";
modalContent.style.maxWidth = "90%";
modalContent.style.lineHeight = "1.6";
modalContent.id = "modalContent";

const closeBtn = document.createElement("button");
closeBtn.textContent = "閉じる";
closeBtn.style.marginTop = "10px";
closeBtn.onclick = () => { modal.style.display = "none"; };

modal.appendChild(modalContent);
modal.appendChild(closeBtn);
document.body.appendChild(modal);

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
  const m = parseInt(document.getElementById("monthSelect").value) - 1;
  generateCalendar(y, m);
});




document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("showCalendarButton");
  if (btn) {
    btn.addEventListener("click", () => {
      const year = parseInt(document.getElementById("yearSelect").value);
      const month = parseInt(document.getElementById("monthSelect").value) - 1;
      generateCalendar(year, month);
    });
  }
});


    // 種目ごとの回数カウントと棒グラフ描画
    const activityCounts = {
      swim: 0, bike: 0, run: 0,
      trampoline: 0, ballet: 0, workout: 0, off: 0
    };

    Object.keys(localStorage).forEach(key => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
        const record = JSON.parse(localStorage.getItem(key));
        if (record.trainings && Array.isArray(record.trainings)) {
          record.trainings.forEach(t => {
            if (activityCounts[t.type] !== undefined) {
              activityCounts[t.type]++;
            }
          });
        }
      }
    });

    const activityLabels = ['🏊‍♂️ Swim', '🚴‍♂️ Bike', '🏃‍♂️ Run', '🪽 トランポリン', '🩰 バレエ', '💪 筋トレ', '🚫 OFF'];
    const activityData = [
      activityCounts.swim,
      activityCounts.bike,
      activityCounts.run,
      activityCounts.trampoline,
      activityCounts.ballet,
      activityCounts.workout,
      activityCounts.off
    ];
    const activityColors = ['#4bc0c0', '#ffcd56', '#36a2eb', '#9966ff', '#ff6384', '#ff9f40', '#aaaaaa'];

    const activityCtx = document.getElementById('activityChart').getContext('2d');
    new Chart(activityCtx, {
      type: 'bar',
      data: {
        labels: activityLabels,
        datasets: [{
          label: '実施回数',
          data: activityData,
          backgroundColor: activityColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: 'white' } }
        },
        scales: {
          x: { ticks: { color: 'white' } },
          y: { beginAtZero: true, ticks: { color: 'white' } }
        }
      }
    });
