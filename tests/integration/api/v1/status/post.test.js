import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const resposeBody = await response.json();
      expect(resposeBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Método não permitido.",
        action: "Verifique se o método HTTP utilizado está correto.",
        statusCode: 405,
      });
    });
  });
});
