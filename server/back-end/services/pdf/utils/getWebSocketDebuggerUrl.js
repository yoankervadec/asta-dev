//
// server/back-end/services/pdf/utils/getWebSocketDebuggerUrl.js

import axios from "axios";

export const getWebSocketDebuggerUrl = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:9222/json/version");
    const browserWsUrl = response.data.webSocketDebuggerUrl;
    if (!browserWsUrl) {
      throw new Error("No WebSocket URL found");
    }
    return browserWsUrl;
  } catch (error) {
    throw new Error(`Failed to fetch WebSocket URL: ${error.message}`);
  }
};
