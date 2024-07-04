import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);
  const resposeBody1 = await response1.json();
  expect(Array.isArray(resposeBody1)).toBe(true);
  expect(resposeBody1.length).toBeGreaterThan(0);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);
  const resposeBody2 = await response2.json();
  expect(Array.isArray(resposeBody2)).toBe(true);
  expect(resposeBody2.length).toBe(0);
});
