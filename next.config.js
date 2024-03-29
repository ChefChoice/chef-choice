/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@babel/preset-react',
  '@fullcalendar/daygrid',
  '@fullcalendar/interaction',
  '@fullcalendar/react',
  '@fullcalendar/timegrid',
  '@fullcalendar/list',
]);

module.exports = withTM({
  // your custom config goes here
  reactStrictMode: true,
  images: {
    domains: [`${process.env.NEXT_PUBLIC_SUPABASE_DOMAIN}`, `${process.env.CLIENT_DOMAIN}`],
  },
});
