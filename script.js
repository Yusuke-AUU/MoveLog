
const MET_VALUES = {
  swim: { met: 10.3, useDistance: true, factor: 0.13, unit: "m" },
  bike: { met: 10.0, useDistance: true, factor: 0.35, unit: "km" },
  run: { met: 11.5, useDistance: true, factor: 1.0, unit: "km" },
  trampoline: { met: 8.0, useDistance: false },
  ballet: { met: 7.0, useDistance: false },
  strength: { met: 7.5, useDistance: false }
};

let records = JSON.parse(localStorage.getItem('records')) || [];

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
    <label class="distanceLabel" style="display:none;">距離: <input type="number" class="distance"></label>
  `;
  div.querySelector('.activity').addEventListener('change', function() {
    const act = this.value;
    const useDist = MET_VALUES[act].useDistance;
    const unit = MET_VALUES[act].unit || "";
    const label = div.querySelector('.distanceLabel');
    label.innerHTML = `距離 (${unit}): <input type='number' class='distance'>`;
    label.style.display = useDist ? "block" : "none";
  });
  document.getElementById('trainingContainer').appendChild(div);
});

document.getElementById('recordForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const intake = parseFloat(document.getElementById('intake').value);
  let totalCalories = 0;

  document.querySelectorAll('.training').forEach(t => {
    const act = t.querySelector('.activity').value;
    const dur = parseFloat(t.querySelector('.duration').value);
    const distInput = t.querySelector('.distance');
    const dist = distInput && distInput.value ? parseFloat(distInput.value) : 0;
    const metInfo = MET_VALUES[act];

    let cal = 0;
    if (metInfo.useDistance && dist > 0) {
      cal = act === 'swim'
        ? weight * dist * metInfo.factor / 1000
        : weight * dist * metInfo.factor;
    } else {
      const hours = dur / 60;
      cal = metInfo.met * weight * hours;
    }
    totalCalories += cal;
  });

  const bmr = 66.47 + (13.75 * weight) + (5.003 * 172) - (6.755 * 42);
  const tdee = bmr * 1.725;
  const totalBurned = tdee + totalCalories;
  const balance = intake - totalBurned;

  const record = {
    date, weight, intake, totalCalories: Math.round(totalCalories),
    baseCalories: Math.round(tdee), totalBurned: Math.round(totalBurned),
    balance: Math.round(balance)
  };
  records.push(record);
  localStorage.setItem('records', JSON.stringify(records));
  updateSummary(record);
});

function updateSummary(record) {
  document.getElementById('summaryText').innerHTML = `
    体重: ${record.weight}kg<br>
    摂取: ${record.intake} kcal<br>
    運動消費: ${record.totalCalories} kcal<br>
    基礎代謝＋活動: ${record.baseCalories} kcal<br>
    合計消費: ${record.totalBurned} kcal<br>
    カロリー差分: <strong style="color:${record.balance < 0 ? 'green' : 'red'};">
      ${record.balance} kcal</strong>
  `;
}
