import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const resposeBody = await response.json();
  return resposeBody;
}

function UpdatedAt({ date }) {
  const updateAtText = new Date(date).toLocaleString();
  // return <pre>{JSON.stringify(data, null, 2)}</pre>;
  return <div>Última atualização: {updateAtText}</div>;
}

function DataBaseStatus({ status }) {
  return (
    <>
      <h2>Banco de dados</h2>
      <p>Versão: {status.version}</p>
      <p>Conexões abertas: {status.opened_connections}</p>
      <p>Conexões máximas: {status.max_connections}</p>
    </>
  );
}

function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  return isLoading || !data ? (
    "Carregando..."
  ) : (
    <>
      <h1>Status</h1>
      <UpdatedAt date={data.updated_at} />
      <DataBaseStatus status={data.dependencies.database} />
    </>
  );
}

export default StatusPage;
