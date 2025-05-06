
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

  document.getElementById("showCalendarButton").addEventListener("click", () => {
    const year = parseInt(document.getElementById("yearSelect").value);
    const month = parseInt(document.getElementById("monthSelect").value) - 1;
    generateCalendar(year, month);
  });

  window.generateCalendar = function (year, month) {
    const container = document.getElementById('calendarContainer');
    container.innerHTML = '';
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
        const r = JSON.parse(localStorage.getItem(dateStr));
        if (r) {
          let html = `📅 ${r.date}<br>⚖️ 体重: ${r.weight}kg<br>🍙 摂取: ${r.intake} kcal<br>`;
          if (r.trainings && r.trainings.length > 0) {
            r.trainings.forEach(t => {
              const iconMap = { swim: "🏊‍♂️", bike: "🚴‍♂️", run: "🏃‍♂️", trampoline: "🪽", ballet: "🩰", workout: "💪", off: "🚫" };
              let line = iconMap[t.type] + " ";
              line += t.distance ? `${t.minutes}分, ${t.distance}km, ${t.calories}kcal` : `${t.minutes}分, ${t.calories}kcal`;
              html += line + "<br>";
            });
          }
          html += `💓 合計消費: ${Math.round(r.totalBurned)} kcal<br>
⚖️ 差分: ${Math.round(r.balance)} kcal<br>
📉 増減: ${r.theoryLoss >= 0 ? '+' : ''}${r.theoryLoss}kg`;
          document.getElementById("modalContent").innerHTML = html;
          document.getElementById("detailModal").style.display = "flex";
        }
      });

      container.appendChild(dayDiv);
    }
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

  // モーダル
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

  populateYearMonthSelectors();
  showTab('record');
});
