export default()=> ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: process.env.DB_TYPE || 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '3306',
        user: process.env.DB_USERNAME || 'root',
        pass: process.env.DB_PASS || '',
        name: process.env.DB_NAME || 'bookstore'
    }
})