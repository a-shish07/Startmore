// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: [
//           {
//             key: "Access-Control-Allow-Origin",
//             // value: "http://localhost:5173",
//             value: "https://artemore-ecommerce.vercel.app",
//           },
//           {
//             key: "Access-Control-Allow-Methods",
//             value: "GET, POST, PUT, DELETE, OPTIONS",
//           },
//           {
//             key: "Access-Control-Allow-Headers",
//             value: "Content-Type, Authorization",
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDFKit needs its own runtime files such as Helvetica.afm
  serverExternalPackages: ["pdfkit"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value:
              process.env.NODE_ENV === "production"
                ? "https://artemore-ecommerce.vercel.app"
                : "http://localhost:5173",
          },
          {
            key: "Access-Control-Allow-Methods",
            value:
              "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-User-Id",
          },
        ],
      },
    ];
  },
};

export default nextConfig;