const trainingTypes = [
  { name: "スイム", emoji: "🏊‍♂️" },
  { name: "バイク", emoji: "🚴‍♂️" },
  { name: "ラン", emoji: "🏃‍♂️" },
  { name: "トランポリン", emoji: "🪽" },
  { name: "バレエ", emoji: "🩰" },
  { name: "筋トレ", emoji: "💪" }
];

function addTraining() {
  const container = document.getElementById("trainings");
  const div = document.createElement("div");
  const select = document.createElement("select");
  trainingTypes.forEach(t => {
    const option = document.createElement("option");
    option.value = t.name;
    option.textContent = `${t.emoji} ${t.name}`;
    select.appendChild(option);
  });
  const time = document.createElement("input");
  time.type = "number";
  time.placeholder = "時間 (分)";
  const distance = document.createElement("input");
  distance.type = "number";
  distance.placeholder = "距離 (任意)";
  div.appendChild(select);
  div.appendChild(time);
  div.appendChild(distance);
  container.appendChild(div);
}

function saveLog() {
  const date = document.getElementById("date").value;
  const weight = document.getElementById("weight").value;
  const caloriesIn = document.getElementById("caloriesIn").value;
  const trainings = Array.from(document.querySelectorAll("#trainings div")).map(div => {
    const [select, time, distance] = div.querySelectorAll("select, input");
    return {
      type: select.value,
      time: +time.value,
      distance: +distance.value || 0
    };
  });
  const log = { date, weight, caloriesIn, trainings };
  document.getElementById("output").textContent = JSON.stringify(log, null, 2);
}
