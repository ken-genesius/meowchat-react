import { createConsumer } from "@rails/actioncable";

// Create a consumer (WebSocket connection)
const cable = createConsumer("ws://localhost:3000/cable");

export default cable;