let domain = null;

function format(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url;

  // Only allow http/https
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    document.getElementById("domainDisplay").textContent = "Unsupported page";
    document.getElementById("timeInfo").textContent =
      "This extension only works on http/https pages.";
    document.getElementById("limitInput").disabled = true;
    document.getElementById("saveBtn").disabled = true;
    document.getElementById("resetBtn").disabled = true;
    return;
  }

  const parsedUrl = new URL(url);
  domain = parsedUrl.hostname;
  document.getElementById("domainDisplay").textContent = domain;

  chrome.storage.local.get(["limits", "timeSpent"], (data) => {
    const limits = data.limits || {};
    const timeSpent = data.timeSpent || {};

    const limit = limits[domain];
    const spent = timeSpent[domain] || 0;

    if (limit) {
      const left = Math.max(limit - spent, 0);
      document.getElementById("timeInfo").textContent = `Time Left: ${format(
        left
      )} / ${format(limit)}`;
      document.getElementById("limitInput").value = limit / 60;
    } else {
      document.getElementById(
        "timeInfo"
      ).textContent = `Not being tracked yet.`;
    }
  });
});

document.getElementById("saveBtn").onclick = () => {
  const mins = parseInt(document.getElementById("limitInput").value);
  if (isNaN(mins) || mins < 1) return alert("Enter a valid number of minutes.");
  chrome.storage.local.get("limits", (data) => {
    const limits = data.limits || {};
    limits[domain] = mins * 60;
    chrome.storage.local.set({ limits }, () => alert("Saved!"));
  });
};

document.getElementById("resetBtn").onclick = () => {
  chrome.storage.local.get("timeSpent", (data) => {
    const timeSpent = data.timeSpent || {};
    timeSpent[domain] = 0;
    chrome.storage.local.set({ timeSpent }, () => {
      alert("Timer reset!");
    });
  });
};
