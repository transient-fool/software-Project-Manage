module.exports = {
  // 数据库配置
  db: {
    url: 'mongodb://localhost:27017/ship_management',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }
  },
  
  // 服务器配置
  server: {
    port: 3002,
    host: 'localhost'
  }
}; 