# Time Blocker – Browser Productivity Extension

A minimal and local-only browser extension that helps you control time spent on distracting websites.  
You can set time limits per site, monitor active usage, and block access once the limit is exceeded. Everything works locally in your browser.
No chance of any data leaks.

---

## Features

- Set daily time limits for individual websites
- View real-time countdowns while browsing
- See visual usage summaries across 7, 14, and 30 days
- Interface includes a popup, dashboard, and block page
- All data stored locally using Chrome's `storage.local`

---

## Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/fee4cd81-f835-4441-bbf5-9bc643edbff5" width="358" height="511" alt="Time Blocker Screenshot">
</p>
<p align="center"> Popup State</p>
<img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/b2df5d94-5744-40a6-bc24-6be7cbbabb17" />
<p align="center"> Dashboard State</p>
<img width="1919" height="941" alt="image" src="https://github.com/user-attachments/assets/eb899747-591c-43d7-a403-728c61b91ae5" />
<p align="center"> Blocked State </p>

---

## Installation

### Option 1: Load Unpacked (for development or testing)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable Developer Mode
4. Click "Load unpacked"
5. Select the folder containing the extension files

### Option 2: Use Microsoft Edge with `.crx`

1. Pack the extension using Chrome's "Pack extension" feature
2. Open Microsoft Edge
3. Drag and drop the `.crx` file into the browser window
4. Click "Add extension" when prompted

Note: Chrome no longer allows direct `.crx` installs unless you're using enterprise distribution.

---

## How It Works

- The extension only works on `http` and `https` pages
- When a timer is set, time starts counting as long as the page is active
- Once the daily time limit is reached, the site is blocked and replaced with a custom page. ( You can delete it )
- The dashboard shows usage and logs for each tracked domain

---

## Privacy Policy

This extension does not collect, store, or transmit any personal or behavioral data.  
All usage logs and settings are stored locally in your browser using Chrome’s extension storage APIs.

---

## Feature Request 

Mail to - > 7apoorvg[at]gmail[dot]com

<a href="https://www.buymeacoffee.com/7apoorvg" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

