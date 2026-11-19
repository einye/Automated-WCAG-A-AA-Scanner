document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scanBtn');
  const viewResultsBtn = document.getElementById('viewResultsBtn');
  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  const errorDiv = document.getElementById('error');
  const openOptions = document.getElementById('openOptions');
  
  // UI Elements
  const overallScoreEl = document.getElementById('overallScore');
  const visualScoreEl = document.getElementById('visualScore');
  const motorScoreEl = document.getElementById('motorScore');
  const cognitiveScoreEl = document.getElementById('cognitiveScore');
  const pdfLinkEl = document.getElementById('pdfLink');

  openOptions.addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  const getDashboardUrls = async () => {
    const storageData = await chrome.storage.sync.get({
      backendUrl: 'http://localhost:3000',
      frontendUrl: 'http://localhost:5173'
    });
    
    let backendUrl = storageData.backendUrl;
    if (backendUrl.endsWith('/')) backendUrl = backendUrl.slice(0, -1);

    let frontendUrl = storageData.frontendUrl;
    if (frontendUrl.endsWith('/')) frontendUrl = frontendUrl.slice(0, -1);

    return { backendUrl, frontendUrl };
  };

  viewResultsBtn.addEventListener('click', async () => {
    const { frontendUrl } = await getDashboardUrls();
    chrome.tabs.create({ url: `${frontendUrl}?source=extension` });
  });

  scanBtn.addEventListener('click', async () => {
    try {
      // Get the currently active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error("Could not find active tab.");

      // Reset UI
      scanBtn.disabled = true;
      loadingDiv.classList.remove('hidden');
      resultsDiv.classList.add('hidden');
      errorDiv.classList.add('hidden');

      // Inject script to get the DOM
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.documentElement.outerHTML
      });

      if (!injectionResults || !injectionResults[0] || !injectionResults[0].result) {
        throw new Error("Failed to capture page content.");
      }

      const htmlContent = injectionResults[0].result;
      
      // Get the URLs from storage
      const { backendUrl, frontendUrl } = await getDashboardUrls();

      // Prepare payload
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const formData = new FormData();
      formData.append('htmlFile', blob, 'scanned_page.html');

      // Send to backend for scanning
      const endpoint = `${backendUrl}/api/scan-html`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        let errStr = `Server returned ${response.status}`;
        try {
          const errData = await response.json();
          errStr = errData.error || errStr;
        } catch(e) {}
        throw new Error(errStr);
      }

      const data = await response.json();
      
      // Save scan data to chrome.storage.local
      await chrome.storage.local.set({ latestScanResult: data });

      // Send to the backend store endpoint
      try {
        await fetch(`${backendUrl}/api/extension-scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.error('Failed to temporarily store results on server', err);
      }

      // Update UI with results
      overallScoreEl.textContent = data.overallScore !== undefined ? data.overallScore : '-';
      visualScoreEl.textContent = data.scores?.visual !== undefined ? data.scores.visual : '-';
      motorScoreEl.textContent = data.scores?.motor !== undefined ? data.scores.motor : '-';
      cognitiveScoreEl.textContent = data.scores?.cognitive !== undefined ? data.scores.cognitive : '-';

      if (data.pdfDownload) {
        pdfLinkEl.href = `${backendUrl}${data.pdfDownload}`;
        pdfLinkEl.classList.remove('hidden');
      } else {
        pdfLinkEl.classList.add('hidden');
      }

      loadingDiv.classList.add('hidden');
      resultsDiv.classList.remove('hidden');

      // Open in a new tab with ?source=extension
      chrome.tabs.create({ url: `${frontendUrl}?source=extension` });

    } catch (err) {
      console.error(err);
      errorDiv.textContent = `Error: ${err.message}`;
      errorDiv.classList.remove('hidden');
      loadingDiv.classList.add('hidden');
    } finally {
      scanBtn.disabled = false;
    }
  });
});
