import "app/globals.css";
import productsData from "app/public/products.json";
import Image from "next/image";
import { generatePayloadPix } from "infra/payload.js";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

function ProductList({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full px-4">
      {products
        .filter((x) => x.price && x.name.toLowerCase().includes("fralda"))
        .map((product, index) => (
          <div
            key={index}
            className="flex flex-col justify-between border-2 p-6 rounded-xl border-blue-200 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <Image
                src={product.thumbnail}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-48 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-blue-800 mb-2">
              {product.name}
            </h2>
            <p className="text-blue-600 text-lg font-semibold mb-4">
              R$ {product.price?.toFixed(2)}
            </p>
            <button
              onClick={() => setSelectedProduct(product)}
              className="mt-auto w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-102 transition-all duration-300 font-medium"
            >
              Mostrar Pix
            </button>
          </div>
        ))}
      {selectedProduct && (
        <QRModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function QRModal({ product, onClose }) {
  const [pixQrCodeValue, setPixQrCodeValue] = useState("");
  const [copyPix, setCopyPix] = useState(false);

  useEffect(() => {
    setPixQrCodeValue(
      generatePayloadPix({
        key: "afa0e314-252b-4579-aac3-c8e8e5588415",
        name: "Raphaell",
        city: "FORTALEZA",
        transactionId: `NICOLAS${new Date().getTime()}`,
        message: "",
        cep: "60744780",
        value: product.price,
      }),
    );
  }, [product]);

  const handleOnCopyPasteClick = () => {
    if (!copyPix && !!pixQrCodeValue) {
      setCopyPix(true);
      navigator.clipboard.writeText(pixQrCodeValue);
      setTimeout(() => {
        setCopyPix(false);
      }, 5000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl flex items-center flex-col border-2 border-blue-200 shadow-2xl max-w-md w-full">
        <div className="bg-blue-50 p-6 rounded-xl mb-6 w-full">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
            {product.name}
          </h2>
          {pixQrCodeValue && (
            <div className="flex justify-center">
              <QRCodeSVG value={`${pixQrCodeValue}`} size={200} />
            </div>
          )}
        </div>
        <p className="text-blue-600 text-2xl font-bold mb-6">
          R$ {product.price?.toFixed(2)}
        </p>
        <button
          onClick={handleOnCopyPasteClick}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-102 transition-all duration-300 font-medium mb-3"
        >
          {!copyPix ? "Pix Copiar e Colar" : "Copiado! ✓"}
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-100 text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-200 transform hover:scale-102 transition-all duration-300 font-medium"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function NicolasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="container mx-auto py-12 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-12 text-blue-700 animate-bounce max-md:text-2xl">
          👶 Bem-vindo Nicolas! 🎉
        </h1>
        <ProductList products={productsData.results} />
      </div>
    </div>
  );
}

export default NicolasPage;