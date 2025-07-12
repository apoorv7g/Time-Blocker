function format(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function updateList(filter = "") {
  chrome.storage.local.get(["limits", "timeSpent", "startTimes"], (data) => {
    const limits = data.limits || {};
    const spent = data.timeSpent || {};
    const startTimes = data.startTimes || {};

    const container = document.getElementById("siteList");
    container.innerHTML = "";

    Object.keys(limits).forEach((domain) => {
      if (filter && !domain.includes(filter)) return;

      const limit = limits[domain];
      const used = spent[domain] || 0;
      const left = Math.max(limit - used, 0);
      const percent = Math.min((used / limit) * 100, 100);
      const startTime = startTimes[domain];

      const row = document.createElement("div");
      row.className = "site-row";
      row.innerHTML = `
        <strong>${domain}</strong><br/>
        <div class="bar-bg">
          <div class="bar-fill" style="width: ${percent}%;"></div>
        </div>
        <p>${format(left)} remaining / ${format(limit)} total</p>
        <p><em>Started: ${startTime ? formatDate(startTime) : "N/A"}</em></p>
        <button class="delete-limit-btn" data-domain="${domain}">Delete Timer</button>
      `;
      container.appendChild(row);
    });

    if (Object.keys(limits).length === 0) {
      container.innerText = "No timers set.";
    }

    loadLogsUI(); // Logs still work independently
  });
}

function loadLogsUI() {
  chrome.storage.local.get("dailyLogs", (data) => {
    const dailyLogs = data.dailyLogs || {};
    const domainSelect = document.getElementById("domainSelect");

    // Store currently selected value
    const previousValue = domainSelect.value;

    domainSelect.innerHTML = "";

    Object.keys(dailyLogs).forEach((domain) => {
      const opt = document.createElement("option");
      opt.value = domain;
      opt.textContent = domain;
      domainSelect.appendChild(opt);
    });

    if (Object.keys(dailyLogs).length > 0) {
      // Try to preserve previous selection, or fallback to first
      domainSelect.value = dailyLogs.hasOwnProperty(previousValue)
        ? previousValue
        : domainSelect.options[0].value;

      updateLogTable(domainSelect.value, 7);
    } else {
      const tbody = document.querySelector("#logTable tbody");
      tbody.innerHTML = "<tr><td colspan='2'>No log data found.</td></tr>";
    }
  });
}

function updateLogTable(domain, days) {
  chrome.storage.local.get("dailyLogs", (data) => {
    const tbody = document.querySelector("#logTable tbody");
    tbody.innerHTML = "";

    const logs = (data.dailyLogs?.[domain] || [])
      .filter((log) => {
        return log.date >= new Date().setHours(0, 0, 0, 0) - days * 86400000;
      })
      .sort((a, b) => b.date - a.date);

    logs.forEach((log) => {
      const tr = document.createElement("tr");
      const date = new Date(log.date);
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      td1.textContent = date.toLocaleDateString();
      td2.textContent = format(log.seconds);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    });

    if (logs.length === 0) {
      tbody.innerHTML =
        "<tr><td colspan='2'>No logs for selected period.</td></tr>";
    }
  });
}

document.getElementById("domainSelect").addEventListener("change", (e) => {
  updateLogTable(e.target.value, 7);
});

document.querySelectorAll("#logControls button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const domain = document.getElementById("domainSelect").value;
    const days = parseInt(btn.dataset.days);
    updateLogTable(domain, days);
  });
});

document.getElementById("searchBox").addEventListener("input", (e) => {
  updateList(e.target.value.trim());
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-limit-btn")) {
    const domain = e.target.dataset.domain;
    if (!confirm(`Remove the timer for ${domain}?`)) return;

    chrome.storage.local.get("limits", (data) => {
      const limits = data.limits || {};
      delete limits[domain];
      chrome.storage.local.set({ limits }, () => {
        updateList(document.getElementById("searchBox").value.trim());
      });
    });
  }
});

updateList();
setInterval(
  () => updateList(document.getElementById("searchBox").value.trim()),
  5000
);
