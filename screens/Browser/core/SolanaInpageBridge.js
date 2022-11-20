const scriptTagContent = `(function(){
  window.sollet = {
    postMessage: (message) => {
      const listener = (event) => {
        if (event.detail.id === message.id) {
          window.removeEventListener("sollet_contentscript_message", listener);
          window.postMessage(event.detail);
        }
      };
      window.addEventListener("sollet_contentscript_message", listener);
      window.dispatchEvent(
        new CustomEvent("sollet_injected_script_message", { detail: message })
      );
    },
  };
})()
`;

const script = `(function() {
  const container = document.head || document.documentElement;
  const scriptTag = document.createElement("script");
  scriptTag.setAttribute("async", "false");
  scriptTag.innerHtml = ${scriptTagContent};
  container.insertBefore(scriptTag, container.children[0]);
  container.removeChild(scriptTag);
  
  window.addEventListener("sollet_injected_script_message", (event) => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        name: "solana-provider",
        channel: "sollet_contentscript_background_channel",
        payload: event.detail,
      }),
      (response) => {
        // Can return null response if window is killed
        if (!response) {
          return;
        }
        window.dispatchEvent(
          new CustomEvent("sollet_contentscript_message", { detail: response })
        );
      }
    );
  });
})()`;

export default script;
