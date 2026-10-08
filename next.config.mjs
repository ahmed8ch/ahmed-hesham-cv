/** @type {import("next").NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/ahmed-hesham-cv" : "",
  assetPrefix: isGitHubPages ? "/ahmed-hesham-cv/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
