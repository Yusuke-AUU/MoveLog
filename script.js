
window.addEventListener('DOMContentLoaded', function() {
const FIXED_METABOLISM = 2000;

const FIXED_ACTIVITIES = {
  trampoline: 450,
  ballet: 450,
  strength: 800
};

const activityOptions = `
  <option value="trampoline">🪽 トランポリン</option>
  <option value="ballet">🩰 バレエ</option>
  <option value="swim">🏊‍♂️ スイム</option>
  <option value="bike">🚴‍♂️ バイク</option>
  <option value="run">🏃‍♂️ ラン</option>
  <option value="strength">💪 筋トレ</option>
`;

document.getElementById('addTraining').addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = "training";
  div.innerHTML = `
    <label>種目:
      <select class="activity">${activityOptions}</select>
    </label>
    <label>時間（分）: <input type="number" class="duration" min="1" required></label>
    <label class="distanceLabel">距離 (km): <input type="number" class="distance"></label>
  `;
  div.querySelector('.activity').addEventListener('change', function() {
    const act = this.value;
    const distanceInput = div.querySelector('.distanceLabel');
    distanceInput.style.display = ['swim', 'bike', 'run'].includes(act) ? "inline" : "none";
  });
  document.getElementById('trainingContainer').appendChild(div);
});

document.getElementById('recordForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const intake = parseFloat(document.getElementById('intake').value);
  let totalCalories = 0;
  let trainingDetails = [];

  document.querySelectorAll('.training').forEach(t => {
    const act = t.querySelector('.activity').value;
    const dur = parseFloat(t.querySelector('.duration').value);
    const dist = parseFloat(t.querySelector('.distance')?.value || 0);
    let cal = 0;

    if (FIXED_ACTIVITIES[act]) {
      cal = (dur / 60) * FIXED_ACTIVITIES[act];
    } else if (act === 'swim') {
      // swim: 3km50分 = 850kcal → 分速 = 3/50 km/min, 単位距離あたり 850 / 3 km = 283.3kcal/km（固定）
      const speed = dist / dur; // km/min
      const referenceSpeed = 3 / 50; // km/min
      cal = (dist * (speed / referenceSpeed)) * (850 / 3);
    } else if (act === 'bike') {
      cal = ((dist / 30) + (dur / 50)) * 425;
    } else if (act === 'run') {
      cal = ((dist / 10) + (dur / 60)) * 425;
    }

    trainingDetails.push({
      type: act,
      calories: Math.round(cal)
    });

    totalCalories += cal;
  });

  const totalBurned = totalCalories + FIXED_METABOLISM;
  const balance = intake - totalBurned;
  const lossTheory = Math.round((balance / 700 * 0.1) * 100) / 100;

  const record = {
    date, weight, intake,
    totalCalories: Math.round(totalCalories),
    metabolism: FIXED_METABOLISM,
    totalBurned: Math.round(totalBurned),
    balance: Math.round(balance),
    theoryLoss: lossTheory,
    details: trainingDetails
  };

  localStorage.setItem('latestRecord', JSON.stringify(record));
  updateSummary(record);
});

function updateSummary(record) {
  let detailsHtml = '';
  record.details.forEach(t => {
    let emoji = {
      swim: '🏊‍♂️',
      bike: '🚴‍♂️',
      run: '🏃‍♂️',
      trampoline: '🪽',
      ballet: '🩰',
      strength: '💪'
    }[t.type] || '';
    detailsHtml += `${emoji} ${t.type}: ${t.calories} kcal<br>`;
  });

  const theoryText = `${record.theoryLoss > 0 ? '-' : '+'}${Math.abs(record.theoryLoss)} kg`;

  document.getElementById('summaryText').innerHTML = `
    📅 日付: ${record.date}<br>
    ⚖️ 体重: ${record.weight}kg<br>
    🍙 摂取: ${record.intake} kcal<br>
    🔋 基礎代謝: ${record.metabolism} kcal<br>
    ${detailsHtml}
    🔥 運動消費: ${record.totalCalories} kcal<br>
    💓 合計消費（含：基礎代謝）: ${record.totalBurned} kcal<br>
    ⚖️ カロリー差分: <strong style='color:${record.balance < 0 ? 'green' : 'red'}'>
      ${record.balance} kcal</strong><br>
    📉 理論増減値: ${theoryText}
  `;
}
});
