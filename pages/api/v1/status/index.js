import database from "infra/database.js";

async function status(req, res) {
  const updatedAt = new Date().toISOString();
  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersionValue = dbVersionResult.rows[0].server_version;
  const dbMaxConnectionsResult = await database.query("SHOW max_connections;");
  const dbMaxConnectionsVersionValue =
    +dbMaxConnectionsResult.rows[0].max_connections;
  const databaseName = process.env.POSTGRES_DB;
  const dbOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1",
    values: [databaseName],
  });
  const dbOpenedConnectionsValue = dbOpenedConnectionsResult.rows[0].count;
  res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: dbVersionValue,
        max_connections: dbMaxConnectionsVersionValue,
        opened_connections: dbOpenedConnectionsValue,
      },
    },
  });
}

export default status;
