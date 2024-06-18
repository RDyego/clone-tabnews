import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const resposeBody = await response.json();
  expect(resposeBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(resposeBody.updated_at).toISOString();
  expect(resposeBody.updated_at).toEqual(parsedUpdatedAt);
  expect(resposeBody.dependencies.database.version).toEqual("16.0");
  expect(resposeBody.dependencies.database.max_connections).toEqual(100);
  expect(resposeBody.dependencies.database.opened_connections).toEqual(1);
});
