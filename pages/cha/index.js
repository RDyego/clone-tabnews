import "app/globals.css";
import productsData from "app/public/products.json";
import pampersData from "app/public/pampers.json";
import Image from "next/image";
import { generatePayloadPix } from "infra/payload.js";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/router";

const THEME_COLORS = {
  azul: "#3b82f6",
  rosa: "#ec4899",
  amarelo: "#facc15",
  vermelho: "#ef4444",
  "verde lodo": "#5a7154",
};

function Formulario({ onSubmit }) {
  const [form, setForm] = useState({
    nome: "",
    sexo: "",
    data: "",
    local: "",
    pix: "",
    cor: "verde lodo",
  });

  // Tooltip helper
  const InfoIcon = ({ tip }) => (
    <span
      tabIndex={0}
      className="ml-2 cursor-pointer text-[#5a7154] inline-block align-middle"
      title={tip}
      style={{ outline: "none" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 20 20"
        style={{ display: "inline", verticalAlign: "middle" }}
      >
        <circle
          cx="10"
          cy="10"
          r="9"
          stroke="#5a7154"
          strokeWidth="1"
          fill="none"
        />
        <text
          x="10"
          y="15"
          textAnchor="middle"
          fontSize="13"
          fill="#5a7154"
          fontFamily="Arial"
          fontWeight="bold"
        >
          i
        </text>
      </svg>
    </span>
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.sexo || !form.data || !form.local || !form.pix)
      return;
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg flex flex-col gap-2 border-2 border-[#a5b69d] mt-12"
    >
      <h2 className="text-2xl font-bold text-center text-[#5a7154] mb-4">
        Preencha os dados do chá de fralda
      </h2>
      <label className="flex items-center gap-1">
        Nome do bebê
        <InfoIcon tip="Digite apenas o primeiro nome do bebê, sem acentos ou caracteres especiais." />
      </label>
      <input
        name="nome"
        placeholder="Nome do bebê"
        value={form.nome}
        onChange={handleChange}
        className="border p-2 rounded"
        required
        pattern="[A-Za-z]+"
        title="Somente letras, sem acentos ou caracteres especiais"
      />

      <label className="flex items-center gap-1">
        Sexo do bebê
        <InfoIcon tip="Selecione o sexo do bebê." />
      </label>
      <select
        name="sexo"
        value={form.sexo}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="">Sexo do bebê</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="outro">Outro</option>
      </select>

      <label className="flex items-center gap-1">
        Data do evento
        <InfoIcon tip="Escolha a data do chá de fralda." />
      </label>
      <input
        name="data"
        type="date"
        value={form.data}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <label className="flex items-center gap-1">
        Local do evento
        <InfoIcon tip="Informe o endereço ou local onde será realizado o evento." />
      </label>
      <input
        name="local"
        placeholder="Local do evento"
        value={form.local}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <label className="flex items-center gap-1">
        Chave Pix Aleatória
        <InfoIcon tip="Informe a chave Pix para receber os presentes em dinheiro." />
      </label>
      <input
        name="pix"
        placeholder="Chave Pix Aleatória"
        value={form.pix}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <label className="flex items-center gap-1">
        Cor tema
        <InfoIcon tip="Escolha a cor do tema do chá de fralda." />
      </label>
      <select
        name="cor"
        value={form.cor}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      >
        <option value="azul">Azul</option>
        <option value="rosa">Rosa</option>
        <option value="amarelo">Amarelo</option>
        <option value="vermelho">Vermelho</option>
        <option value="verde lodo">Verde</option>
      </select>
      <button
        type="submit"
        className="text-white p-3 rounded-lg font-medium hover:opacity-90"
        style={{ background: THEME_COLORS[form.cor] || "#5a7154" }}
      >
        Ir para o Chá de Fralda
      </button>
      <div className="mt-6 flex flex-col items-center text-xs text-[#5a7154] gap-1">
        <span>Deus seja louvado.</span>
        <Image
          src="https://abs-0.twimg.com/emoji/v2/svg/1f1fa-1f1e6.svg"
          alt="Ucrânia"
          title="Ucrânia"
          width={22}
          height={22}
          style={{ width: 22, height: 22 }}
        />
        <span>
          Criado por{" "}
          <a
            href="https://github.com/RDyego"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-700"
          >
            Dyego
          </a>{" "}
          e revisado por{" "}
          <a
            href="https://github.com/NicoBala"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-700"
          >
            Nicolas
          </a>
        </span>
      </div>
    </form>
  );
}

function ProductList({ products, themeColor, pixKey, bbName }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full px-4">
      {products
        .filter((x) => x.price)
        .filter((x) => x.name.toLowerCase().includes("fralda"))
        .filter((x) => !x.name.toLowerCase().includes("bigfral"))
        .map((p) => ({ ...p, price: p.price / 100 }))
        .filter((x) => x.price > 45 && x.price < 100)
        .map((product, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between border-2 p-6 rounded-xl`}
            style={{
              borderColor: themeColor,
              background: "#fff",
              boxShadow: "0 2px 8px #0001",
            }}
          >
            <div className="bg-[#f0f4ed] rounded-lg p-4 mb-4">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-contain"
              />
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: themeColor }}
            >
              {product.name}
            </h2>
            <p className="text-[#75906d] text-lg font-semibold mb-4">
              R$ {product.price?.toFixed(2)}
            </p>
            <button
              onClick={() => setSelectedProduct(product)}
              className="mt-auto w-full text-white px-6 py-3 rounded-lg font-medium"
              style={{ background: themeColor }}
            >
              Mostrar Pix
            </button>
          </div>
        ))}
      {selectedProduct && (
        <QRModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          themeColor={themeColor}
          pixKey={pixKey}
          bbName={bbName}
        />
      )}
    </div>
  );
}

function QRModal({ product, onClose, themeColor, pixKey, bbName }) {
  const [pixQrCodeValue, setPixQrCodeValue] = useState("");
  const [copyPix, setCopyPix] = useState(false);
  const [selectedPamper, setSelectedPamper] = useState(null);
  const [totalPrice, setTotalPrice] = useState(product.price);

  useEffect(() => {
    setTotalPrice(
      selectedPamper ? product.price + selectedPamper.price : product.price,
    );
  }, [selectedPamper, product.price]);

  useEffect(() => {
    setPixQrCodeValue(
      generatePayloadPix({
        key: pixKey,
        name: "Chá de " + bbName,
        city: "FORTALEZA",
        transactionId: `${bbName?.toUpperCase() || "BB"}${new Date().getTime()}`,
        message: "",
        cep: "60000000",
        value: totalPrice,
      }),
    );
  }, [totalPrice, pixKey, bbName]);

  const handleOnCopyPasteClick = () => {
    if (!copyPix && !!pixQrCodeValue) {
      setCopyPix(true);
      navigator.clipboard.writeText(pixQrCodeValue);
      setTimeout(() => {
        setCopyPix(false);
      }, 5000);
    }
  };

  const handlePamperSelect = (pamper) => {
    setSelectedPamper(selectedPamper?.asin === pamper.asin ? null : pamper);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="bg-white p-4 gap-2 rounded-2xl flex items-center flex-col border-2 shadow-2xl max-w-md w-full"
        style={{ borderColor: themeColor }}
      >
        <div className="bg-[#f0f4ed] p-2 rounded-xl w-full">
          <h2
            className="text-xl font-bold mb-2 text-center truncate"
            style={{ color: themeColor }}
          >
            {product.name}
          </h2>
          {pixQrCodeValue && (
            <div className="flex justify-center">
              <QRCodeSVG value={`${pixQrCodeValue}`} size={150} />
            </div>
          )}
          <p className="text-[#75906d] text-2xl font-bold flex flex-col justify-center items-center">
            <span>R$ {totalPrice.toFixed(2)}</span>
            {selectedPamper && (
              <span className="text-xs block text-center">(Fralda + Mimo)</span>
            )}
          </p>
        </div>

        <div className="w-full gap-2">
          <h3
            className="text-xl font-bold text-center mb-2"
            style={{ color: themeColor }}
          >
            Escolha um mimo 🎉
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {pampersData.results
              .filter((x) => x.price)
              .filter((x) => !x.name.toLowerCase().includes("boneca"))
              .map((p) => ({ ...p, price: p.price / 100 }))
              .filter((x) => x.price > 10 && x.price < 60)
              .map((pamper, index) => (
                <div
                  key={index}
                  onClick={() => handlePamperSelect(pamper)}
                  className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                    selectedPamper?.asin === pamper.asin
                      ? "bg-[#e5ede0] border-2"
                      : "bg-[#f0f4ed] hover:bg-[#e5ede0]"
                  }`}
                  style={
                    selectedPamper?.asin === pamper.asin
                      ? { borderColor: themeColor }
                      : {}
                  }
                >
                  <div className="w-16 h-16 mr-3 flex-shrink-0">
                    <Image
                      src={pamper.thumbnail}
                      alt={pamper.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className="text-sm font-medium"
                      style={{ color: themeColor }}
                    >
                      {pamper.name.length > 40
                        ? pamper.name.substring(0, 40) + "..."
                        : pamper.name}
                    </h4>
                    <p className="text-[#75906d] text-sm font-semibold">
                      R$ {pamper.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="flex gap-2 justify-center items-center">
          <button
            onClick={handleOnCopyPasteClick}
            className="flex-1 h-12 text-white p-3 rounded-lg font-medium"
            style={{ background: themeColor }}
          >
            {!copyPix ? "Pix Copiar e Colar" : "Copiado! ✓"}
          </button>
          <button
            onClick={onClose}
            className="bg-[#f0f4ed] h-12 p-3 rounded-lg hover:bg-[#e5ede0] font-medium"
            style={{ color: themeColor }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function ChaPage() {
  const router = useRouter();
  const { bb, form } = router.query;
  const [copyUrl, setCopyUrl] = useState(false);
  const handleOnCopyPasteUrlClick = () => {
    if (!copyUrl) {
      setCopyUrl(true);
      navigator.clipboard.writeText(window.location.href);
      setTimeout(() => {
        setCopyUrl(false);
      }, 5000);
    }
  };

  // Decodifica o form se existir
  let formData = null;
  if (form) {
    try {
      formData = JSON.parse(decodeURIComponent(form));
    } catch (e) {
      formData = null;
    }
  }

  // Se não houver bb ou form, mostra o formulário
  if (!bb || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f4ed] via-white to-[#f0f4ed] flex flex-col items-center">
        <Formulario
          onSubmit={(data) => {
            const nome = data.nome.replace(/[^A-Za-z]/g, "");
            const formStr = encodeURIComponent(JSON.stringify(data));
            router.replace({
              pathname: router.pathname,
              query: { bb: nome, form: formStr },
            });
          }}
        />
      </div>
    );
  }

  // Usa cor do tema
  const themeColor = THEME_COLORS[formData.cor] || "#5a7154";

  return (
    <div
      className="min-h-screen bg-gradient-to-b via-white to-[#f0f4ed]"
      style={{
        backgroundImage: `linear-gradient(to bottom, #f0f4ed, white, #f0f4ed)`,
      }}
    >
      <div className="container mx-auto py-12 flex flex-col items-center">
        <h1
          className="text-5xl font-bold mb-12 animate-bounce max-md:text-2xl"
          style={{ color: themeColor }}
        >
          👶 Chá de fraldas {formData.sexo === "feminino" ? "da" : "do"} {bb}!
          🎉
        </h1>
        <div className="mb-6 text-center text-[#5a7154]">
          <button
            type="button"
            onClick={handleOnCopyPasteUrlClick}
            className="mb-3 px-4 py-2 rounded-lg bg-[#5a7154] text-white hover:bg-[#75906d] transition-all text-sm font-medium"
          >
            {!copyUrl ? "Copiar link do Chá de Fralda" : "Copiado! ✓"}
          </button>
          <div>
            <b>Data:</b> {formData.data}
          </div>
          <div>
            <b>Local:</b> {formData.local}
          </div>
          <div>
            <b>Chave Pix:</b> {formData.pix}
          </div>
        </div>
        <ProductList
          products={productsData.results}
          themeColor={themeColor}
          pixKey={formData.pix}
          bbName={bb}
        />
      </div>
    </div>
  );
}

export default ChaPage;
