/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skill files live outside public/. Include them in the server traces so
  // the download route and the skill page can read them on Vercel.
  outputFileTracingIncludes: {
    "/api/skills/[slug]/download": ["./content/skills/**/*"],
    "/skills/[slug]": ["./content/skills/**/*"],
  },
  async redirects() {
    return [
      { source: "/tools", destination: "/skills", permanent: true },
      { source: "/tools/:slug", destination: "/skills", permanent: true },
      { source: "/pricing", destination: "/people-builders", permanent: true },
      { source: "/work-with-us", destination: "/", permanent: false },
    ];
  },
};

module.exports = nextConfig;
