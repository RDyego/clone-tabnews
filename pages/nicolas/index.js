import "app/globals.css";
import productsData from "app/public/products.json";
import pampersData from "app/public/pampers.json";
import Image from "next/image";
import { generatePayloadPix } from "infra/payload.js";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

function ProductList({ products }) {
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
            className="flex flex-col justify-between border-2 p-6 rounded-xl border-[#a5b69d] bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
            <h2 className="text-xl font-bold text-[#5a7154] mb-2">
              {product.name}
            </h2>
            <p className="text-[#75906d] text-lg font-semibold mb-4">
              R$ {product.price?.toFixed(2)}
            </p>
            <button
              onClick={() => setSelectedProduct(product)}
              className="mt-auto w-full bg-[#75906d] text-white px-6 py-3 rounded-lg hover:bg-[#5a7154] transform hover:scale-102 transition-all duration-300 font-medium"
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
  const [selectedPamper, setSelectedPamper] = useState(null);
  const [totalPrice, setTotalPrice] = useState(product.price);

  useEffect(() => {
    // Update total price when pamper is selected or deselected
    setTotalPrice(
      selectedPamper ? product.price + selectedPamper.price : product.price,
    );
  }, [selectedPamper, product.price]);

  useEffect(() => {
    setPixQrCodeValue(
      generatePayloadPix({
        key: "afa0e314-252b-4579-aac3-c8e8e5588415",
        name: "Raphaell",
        city: "FORTALEZA",
        transactionId: `NICOLAS${new Date().getTime()}`,
        message: "",
        cep: "60744780",
        value: totalPrice,
      }),
    );
  }, [totalPrice]);

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
      <div className="bg-white p-4 gap-2 rounded-2xl flex items-center flex-col border-2 border-[#a5b69d] shadow-2xl max-w-md w-full">
        <div className="bg-[#f0f4ed] p-2 rounded-xl w-full">
          <h2 className="text-xl font-bold mb-2 text-[#5a7154] text-center truncate">
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
          <h3 className="text-xl font-bold text-[#5a7154] text-center mb-2">
            Escolha um mimo 🎉
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {pampersData.results
              .filter((x) => x.price)
              .filter((x) => !x.name.toLowerCase().includes("boneca"))
              .map((p) => ({ ...p, price: p.price / 100 }))
              .filter((x) => x.price > 10 && x.price < 60)
              // .slice(0, 5)
              .map((pamper, index) => (
                <div
                  key={index}
                  onClick={() => handlePamperSelect(pamper)}
                  className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                    selectedPamper?.asin === pamper.asin
                      ? "bg-[#e5ede0] border-2 border-[#75906d]"
                      : "bg-[#f0f4ed] hover:bg-[#e5ede0]"
                  }`}
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
                    <h4 className="text-sm font-medium text-[#5a7154]">
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
            className="flex-1 bg-[#75906d] h-12 text-white p-3 rounded-lg hover:bg-[#5a7154] transform hover:scale-102 transition-all duration-300 font-medium"
          >
            {!copyPix ? "Pix Copiar e Colar" : "Copiado! ✓"}
          </button>
          <button
            onClick={onClose}
            className="bg-[#f0f4ed] h-12 text-[#5a7154] p-3 rounded-lg hover:bg-[#e5ede0] transform hover:scale-102 transition-all duration-300 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function NicolasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4ed] via-white to-[#f0f4ed]">
      <div className="container mx-auto py-12 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-12 text-[#5a7154] animate-bounce max-md:text-2xl">
          👶 Chá de fraldas do Nicolas! 🎉
        </h1>
        <ProductList products={productsData.results} />
      </div>
    </div>
  );
}

export default NicolasPage;
