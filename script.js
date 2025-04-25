
// 共通関数：タブ切替
function showTab(id) {
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// 既存ロジック（記録・保存・計算） + カレンダー + Chart.js グラフ生成 を統合
// ※ ここにフルスクリプトが必要（省略中のためプレースホルダ）

// 実装済みロジックに以下を追加：
// - generateCalendar()
// - renderChart()
// - localStorage から全レコード取得、日付順に整形、表示
