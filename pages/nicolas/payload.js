import { crc16ccitt } from "crc";

export function generatePayloadPix({
  key,
  city,
  name,
  value,
  message,
  cep,
  transactionId = "***",
}) {
  const payloadKeyString = generateKey(key, message);

  const payload = [
    genEMV("00", "01"), // version
    genEMV("26", payloadKeyString),
    genEMV("52", "0000"),
    genEMV("53", "986"), // currency
  ];

  if (value) {
    payload.push(genEMV("54", value.toFixed(2)));
  }

  name = String(name)
    .substring(0, 25)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  city = String(city)
    .substring(0, 15)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  payload.push(genEMV("58", "BR")); // countryCode
  payload.push(genEMV("59", name));
  payload.push(genEMV("60", city));

  if (cep) {
    payload.push(genEMV("61", cep));
  }

  payload.push(genEMV("62", genEMV("05", transactionId)));

  payload.push("6304");

  const stringPayload = payload.join("");
  const crcResult = crc16ccitt(stringPayload)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");

  const payloadPIX = `${stringPayload}${crcResult}`;

  return payloadPIX;
}

function generateKey(key, message) {
  const payload = [genEMV("00", "BR.GOV.BCB.PIX"), genEMV("01", key)];
  if (message) {
    payload.push(genEMV("02", message));
  }
  return payload.join("");
}

function genEMV(id, parameter) {
  const len = parameter.length.toString().padStart(2, "0");
  return `${id}${len}${parameter}`;
}
