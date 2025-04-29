document.addEventListener("DOMContentLoaded", () => {
  const summary = document.getElementById("summary-content");
  const modal = document.getElementById("modal");
  const modalDate = document.getElementById("modal-date");
  const modalDetails = document.getElementById("modal-details");
  const closeModal = document.getElementById("closeModal");

  const data = {
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

  function renderSummary() {
    summary.innerHTML = `
      ⚖️ 体重: ${data.weight}<br>
      🍙 摂取: ${data.intake}<br>
      🔋 基礎代謝: ${data.basal}<br>
      🔥 運動消費: ${data.activity}<br>
      💓 合計消費: ${data.total}<br>
      ⚖️ 差分: ${data.diff}<br>
      📉 増減: ${data.delta}<br>
      🏃‍♂️ トレーニング: ${data.training.join(", ")}
    `;
  }

  function showModal() {
    modalDate.textContent = `📅 ${data.date}`;
    modalDetails.innerHTML = summary.innerHTML;
    modal.style.display = "block";
  }

  closeModal.addEventListener("click", () => modal.style.display = "none");

  document.getElementById("calendar").addEventListener("click", showModal);

  renderSummary();
});
