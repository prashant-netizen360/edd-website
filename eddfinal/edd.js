function calculate() {
  const lmp = document.getElementById("lmp").value.trim();
  const today = document.getElementById("today").value.trim();
  const resultDiv = document.getElementById("result");

  resultDiv.innerHTML = "";

  const add_months = 9;
  const add_days = 7;

  try {
    const [lmp_year, lmp_month, lmp_day] = lmp.split("-").map(Number);
    if (!lmp_year || !lmp_month || !lmp_day)
      throw new Error("Invalid LMP format");

    let fixed_day = Math.min(lmp_day, 30);

    let total_months = lmp_month + add_months;
    let year_increment = Math.floor((total_months - 1) / 12);
    let new_month = ((total_months - 1) % 12) + 1;
    let new_year = lmp_year + year_increment;

    let total_days = fixed_day + add_days;
    let month_increment = Math.floor((total_days - 1) / 30);
    let new_day = ((total_days - 1) % 30) + 1;
    new_month += month_increment;

    if (new_month > 12) {
      new_month -= 12;
      new_year += 1;
    }

    resultDiv.innerHTML = `
      <div class="edd-card">
        <h7>Estimated Date of Delivery (EDD)</h7>
        <h4>${new_year.toString().padStart(4, "0")}-${new_month
      .toString()
      .padStart(2, "0")}-${new_day.toString().padStart(2, "0")}</h4>
      </div>
    `;

    if (today !== "") {
      const [t_year, t_month, t_day] = today.split("-").map(Number);
      if (!t_year || !t_month || !t_day)
        throw new Error("Invalid today's date format");

      if (
        t_year < lmp_year ||
        (t_year === lmp_year && t_month < lmp_month) ||
        (t_year === lmp_year &&
          t_month === lmp_month &&
          t_day < lmp_day)
      ) {
        resultDiv.innerHTML =
          '<div class="error">Error: LMP cannot be later than today!</div>';
        return;
      }

      let year_diff = t_year - lmp_year;
      let month_diff = t_month - lmp_month;
      let day_diff = t_day - lmp_day;

      if (day_diff < 0) {
        day_diff += 30;
        month_diff -= 1;
      }
      if (month_diff < 0) {
        month_diff += 12;
        year_diff -= 1;
      }

      const gest_months = year_diff * 12 + month_diff;
      const gest_days = day_diff;
      const total_days_from_months = gest_months * 30 + gest_days;

      const weeks = Math.floor(total_days_from_months / 7);
      const remaining_days = total_days_from_months % 7;

      resultDiv.innerHTML += `
        <div class="ga-card">
          <h7>Gestational Age</h7>
          <h4>${weeks} weeks + ${remaining_days} days</h4>
          <h6>or ${gest_months} months + ${gest_days} days</h6>
        </div>
      `;
    }

    // ✅ Polished modern disclaimer
    resultDiv.innerHTML += `
      <p class="disclaimer">Disclaimer: For guidance only — not a substitute for clinical judgment.</p>
    `;

  } catch (err) {
    resultDiv.innerHTML = `<div class="error">Error: ${err.message}</div>`;
  }
}

document.getElementById("lmp").addEventListener("input", clearResults);
document.getElementById("today").addEventListener("input", clearResults);

function clearResults() {
  document.getElementById("result").innerHTML = "";
}
