process.on("message", (message) => {
  process.send(message);
});
