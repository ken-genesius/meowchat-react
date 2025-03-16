import { createConsumer } from "@rails/actioncable";

const CABLE_URL = import.meta.env.CABLE_URL || "ws://localhost:3000/cable";
// Create a consumer (WebSocket connection)
const cable = createConsumer(CABLE_URL);

export default cable;