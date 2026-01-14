import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createTodoistServer } from "./todoist-server.js";

const app = express();

const server = createTodoistServer();

let transport: SSEServerTransport;

app.get("/sse", async (req, res) => {
    console.log("New SSE connection");
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    console.log("Received message");
    if (!transport) {
        res.status(400).send("No active connection");
        return;
    }
    await transport.handlePostMessage(req, res);
});

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Todoist MCP Server running on port ${PORT}`);
});
