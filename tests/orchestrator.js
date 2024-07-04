import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
      onRetry: (error, attempt) => {
        process.stdout.write(`\rAttempt ${attempt} - ${error.message}`);
      },
    });

    async function fetchStatusPage() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/status1");
        if (!response.ok) throw Error(`HTTP error ${response.status}`);
      } catch (error) {
        throw error;
      }
    }
  }
}

export default {
  waitForAllServices,
};
