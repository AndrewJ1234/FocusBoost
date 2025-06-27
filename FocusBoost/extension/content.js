console.log("🌐 Content script loading on:", window.location.href);

if (window.location.href.includes("localhost")) {
  console.log("✅ On localhost - initializing...");

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    if (event.data.type === "FOCUSBOOST_REQUEST") {
      console.log("📨 Content script received from dashboard:", event.data);
      console.log("🔄 Forwarding to background script...");

      try {
        chrome.runtime.sendMessage(event.data, (response) => {
          console.log("📨 Content script received from background:", response);

          if (chrome.runtime.lastError) {
            console.error(
              "❌ Runtime error:",
              chrome.runtime.lastError.message
            );
            // Send error back to dashboard
            window.postMessage(
              {
                type: "FOCUSBOOST_RESPONSE",
                action: event.data.action,
                payload: { error: chrome.runtime.lastError.message },
              },
              "*"
            );
          } else {
            console.log("✅ Forwarding response back to dashboard");
            // Send response back to dashboard
            window.postMessage(
              {
                type: "FOCUSBOOST_RESPONSE",
                action: event.data.action,
                payload: response,
              },
              "*"
            );
          }
        });
      } catch (error) {
        console.error("❌ Error forwarding to background:", error);
        window.postMessage(
          {
            type: "FOCUSBOOST_RESPONSE",
            action: event.data.action,
            payload: { error: error.message },
          },
          "*"
        );
      }
    }
  });

  // Notify dashboard when ready
  setTimeout(() => {
    console.log("📢 Notifying dashboard extension is ready");
    window.postMessage(
      {
        type: "FOCUSBOOST_EXTENSION_READY",
      },
      "*"
    );
  }, 1000);

  console.log("✅ Content script bridge ready");
} else {
  console.log("❌ Not on localhost, content script not active");
}
