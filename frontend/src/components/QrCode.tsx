import { useState } from "react";
import QRCode from "react-qr-code";

type Props = {
  qrcodeValue: string;
  resetForm: () => void;
};

export default function QrCode({ qrcodeValue, resetForm }: Props) {
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(qrcodeValue);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 2000);
  };

  const downloadQrCode = () => {
    const svg = document.getElementById("qrcodeEl");

    if (!svg) {
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl">Congratulations!</h1>
        <p>Your page was created and is available at the following address:</p>
        <a
          href={qrcodeValue}
          target="_blank"
          className="text-blue-200 underline"
        >
          {qrcodeValue}
        </a>
        {navigator.clipboard && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => copyLinkToClipboard()}
              type="button"
              className={`flex-1 ${
                linkCopied ? "bg-green-600" : "bg-blue-600"
              }`}
              disabled={linkCopied}
            >
              {linkCopied ? "Link copied!" : "Copy link to clipboard"}
            </button>
            <button
              onClick={() => downloadQrCode()}
              type="button"
              className="flex-1 bg-teal-600"
            >
              Download QRCODE
            </button>
          </div>
        )}
      </div>

      <div
        className="bg-white rounded-lg p-5"
        style={{
          height: "auto",
          margin: "0 auto",
          maxWidth: 256,
          width: "100%",
        }}
      >
        <QRCode
          id="qrcodeEl"
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={qrcodeValue}
          viewBox={`0 0 256 256`}
        />
      </div>

      <hr />

      <button
        onClick={() => resetForm()}
        type="button"
        className="flex-1 bg-orange-600"
      >
        I want to generate a new page
      </button>
    </>
  );
}
