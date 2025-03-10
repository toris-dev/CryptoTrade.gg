// app/api/upbit-websocket/route.js
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

// Store active connections
const clients = new Set();

// Create a single WebSocket connection to Upbit
let ws: WebSocket | null = null;
let isConnected = false;

function setupWebSocket() {
  if (ws !== null) return;

  const payload = {
    access_key: process.env.UPBIT_ACCESS_KEY,
    nonce: uuidv4(),
  };

  const jwtToken = jwt.sign(payload, process.env.UPBIT_SECRET_KEY || "");

  ws = new WebSocket("wss://api.upbit.com/websocket/v1/private", {
    headers: {
      authorization: `Bearer ${jwtToken}`,
    },
  });

  ws.on("open", () => {
    console.log("Connected to Upbit WebSocket!");
    isConnected = true;
    // Subscribe to order updates
    ws?.send('[{"ticket":"test example"},{"type":"myOrder"}]');
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("message", (data) => {
    const message = data.toString();
    console.log("Received message:", message);

    // Forward message to all connected clients
    clients.forEach((client: any) => {
      client.write(`data: ${message}\n\n`);
    });
  });

  ws.on("close", () => {
    console.log("Upbit WebSocket connection closed!");
    isConnected = false;
    ws = null;

    // Try to reconnect after a delay
    setTimeout(setupWebSocket, 5000);
  });
}

export async function GET(request: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Set up SSE headers
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  // Initialize WebSocket if not already connected
  if (!isConnected) {
    setupWebSocket();
  }

  // Add this client to our set
  clients.add(writer);

  // Send initial connection status
  writer.write(
    encoder.encode(
      `data: {"status":"connected","message":"Connected to Upbit WebSocket API"}\n\n`
    )
  );

  // Handle client disconnection
  request.signal.addEventListener("abort", () => {
    clients.delete(writer);
    writer.close();
  });

  return new Response(readable, { headers });
}
