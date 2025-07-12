function getDomain(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.hostname;
    }
    return null;
  } catch {
    return null;
  }
}

function logDailyUsage(domain) {
  const today = new Date().setHours(0, 0, 0, 0); // Midnight today

  chrome.storage.local.get("dailyLogs", (data) => {
    const dailyLogs = data.dailyLogs || {};
    if (!dailyLogs[domain]) dailyLogs[domain] = [];

    const logs = dailyLogs[domain];
    let entry = logs.find((e) => e.date === today);

    if (entry) {
      entry.seconds += 1;
    } else {
      logs.push({ date: today, seconds: 1 });
    }

    chrome.storage.local.set({ dailyLogs });
  });
}

// Setup the alarm when extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("tick", { periodInMinutes: 0.016 }); // ~1 second
});

// Alarm-based time tracking
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "tick") return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0] || !tabs[0].url) return;

    const url = tabs[0].url;
    const tabId = tabs[0].id;
    const domain = getDomain(url);
    if (!domain) return;

    chrome.storage.local.get(["limits", "timeSpent", "startTimes"], (data) => {
      const limits = data.limits || {};
      const timeSpent = data.timeSpent || {};
      const startTimes = data.startTimes || {};

      // Always track time
      timeSpent[domain] = (timeSpent[domain] || 0) + 1;
      if (!startTimes[domain]) {
        startTimes[domain] = Date.now();
      }

      chrome.storage.local.set({ timeSpent, startTimes });
      logDailyUsage(domain);

      // Only block if a limit is set
      const limit = limits[domain];
      if (limit === undefined) return;

      const used = timeSpent[domain];
      const percent = used / limit;

      if (percent >= 1) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            window.location.href = chrome.runtime.getURL("block.html");
          },
        });
      } else if (percent >= 0.8 && !globalThis[`warned_${domain}`]) {
        globalThis[`warned_${domain}`] = true;
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            alert("You are almost out of time on this site.");
          },
        });
      }
    });
  });
});
