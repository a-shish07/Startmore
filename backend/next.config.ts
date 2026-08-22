import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDFKit needs its own runtime files such as Helvetica.afm
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;