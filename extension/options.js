// Saves options to chrome.storage
const saveOptions = () => {
  const backendUrl = document.getElementById('backendUrl').value;
  const frontendUrl = document.getElementById('frontendUrl').value;

  chrome.storage.sync.set(
    { backendUrl: backendUrl, frontendUrl: frontendUrl },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get(
    { backendUrl: 'http://localhost:3000', frontendUrl: 'http://localhost:5173' }, // Default values
    (items) => {
      document.getElementById('backendUrl').value = items.backendUrl;
      document.getElementById('frontendUrl').value = items.frontendUrl;
    }
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
