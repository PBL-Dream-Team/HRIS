export default () => ({
  port: process.env.PORT,
  database: {
    url: process.env.DATABASE_URL,
  },
});
