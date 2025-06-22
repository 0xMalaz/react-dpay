import * as signalR from "@microsoft/signalr";

const BASE_URL = "https://api.dpay.local";
let connection: signalR.HubConnection | null = null;

export const startSignalRConnection = (apiKey: string) => {
  const url = "https://socket.dpay.local/dpayHub";

  const postAuthToken = async (): Promise<string> => {
    console.log("hehe");
    const encodedKey = encodeURIComponent(apiKey);
    const response = await fetch(
      `${BASE_URL}/auth/token?apiKey=${encodedKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    if (response.ok) {
      return response.text();
    } else {
      throw new Error("Failed to fetch token");
    }
  };

  connection = new signalR.HubConnectionBuilder()
    .withUrl(url, {
      accessTokenFactory: postAuthToken,
    })
    .withAutomaticReconnect()
    .build();

  connection
    .start()
    .then(() => {
      if (!connection) return;
      console.log("SignalR Connected");

      connection.onclose(() => {
        console.log("Closed");
      });
    })
    .catch((error) => {
      console.error("SignalR connection failed:", error);
    });
};
