
const EventSource = require('eventsource')// const { default: ChartScreen } = require('./src/screens/ChartScreen');
// require(ChartScreen)



const url = 'https://dehype.api.openverse.tech/api/v1/markets/7GL9fMUzY9r6WPCvJbtbJAhNdLr1h8pNf9Je9oqjxapf/live-updates';
const es = new EventSource(url);

console.log('Connecting to SSE server...');

es.onopen = () => {
  console.log('SSE connection opened.');
};

es.onmessage = (event) => {
  console.log('Received event:', event.data);
};

es.onerror = (error) => {
  console.error('Error:', error);
};
