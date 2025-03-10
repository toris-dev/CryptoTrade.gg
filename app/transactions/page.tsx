// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectToSSE = async () => {
      try {
        // Close any existing connection
        if (eventSource) {
          eventSource.close();
        }

        // Connect to our API route
        eventSource = new EventSource("/api/upbit/websocket");

        eventSource.onopen = () => {
          console.log("SSE connection opened");
          setConnected(true);
          setError(null);
        };

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setMessages((prev: any) => [data, ...prev].slice(0, 100)); // Keep last 100 messages
        };

        eventSource.onerror = (e) => {
          console.error("SSE connection error:", e);
          setError("Connection error. Reconnecting...");
          setConnected(false);

          // Close the connection
          eventSource.close();

          // Try to reconnect after a delay
          setTimeout(connectToSSE, 5000);
        };
      } catch (err) {
        console.error("Failed to connect to SSE:", err);
        setError(`Connection failed: ${err.message}`);
        setConnected(false);
      }
    };

    connectToSSE();

    // Clean up on component unmount
    return () => {
      if (eventSource) {
        console.log("Closing SSE connection");
        eventSource.close();
      }
    };
  }, []);

  const handleGetOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    console.log(data);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upbit Order Updates</h1>

      <div className="mb-4">
        <span
          className={`inline-block px-2 py-1 rounded ${
            connected ? "bg-green-500" : "bg-red-500"
          } text-white`}
          onClick={handleGetOrders}
        >
          {connected ? "Connected" : "Disconnected"}
        </span>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="border rounded p-4 max-h-[70vh] overflow-y-auto">
        <h2 className="text-xl mb-2">Messages</h2>
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages received yet...</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <pre
                key={idx}
                className="bg-gray-100 p-2 rounded text-sm overflow-x-auto"
              >
                {JSON.stringify(msg, null, 2)}
              </pre>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
