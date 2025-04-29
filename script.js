document.addEventListener("DOMContentLoaded", () => {
  const summary = document.getElementById("modal-details");
  const modal = document.getElementById("modal");
  const modalDate = document.getElementById("modal-date");
  const closeModal = document.getElementById("closeModal");

  const sampleData = {
    date: "2025-04-27",
    weight: "87.6kg",
    intake: "2000kcal",
    basal: "2000kcal",
    activity: "0kcal",
    total: "2000kcal",
    diff: "0kcal",
    delta: "+0kg",
    training: ["OFF"]
  };

  function openModalWithData(data) {
    modalDate.textContent = `📅 ${data.date}`;
    summary.innerHTML = `
      ⚖️ 体重: ${data.weight}<br>
      🍙 摂取: ${data.intake}<br>
      🔋 基礎代謝: ${data.basal}<br>
      🔥 運動消費: ${data.activity}<br>
      💓 合計消費: ${data.total}<br>
      ⚖️ カロリー差分: ${data.diff}<br>
      📉 増減: ${data.delta}<br>
      🏃‍♂️ トレーニング: ${data.training.join(", ")}
    `;
    modal.style.display = "block";
  }

  // 仮：カレンダーボタン押下でモーダル開く
  document.getElementById("calendarBtn").addEventListener("click", () => {
    openModalWithData(sampleData);
  });

  closeModal.addEventListener("click", () => modal.style.display = "none");
});
