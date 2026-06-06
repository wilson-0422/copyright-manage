import { createApp } from './config/app';
import { initDatabase } from './config/database';
import routes from './routes';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

initDatabase();

const app = createApp();
app.use(routes);

app.use((req, res) => {
  res.status(404).render('index', { error: '页面不存在' });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error('服务器错误:', err);
  res.status(500).render('index', { error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`原创作品版权管理平台已启动`);
  console.log(`访问地址: http://localhost:${PORT}`);
  console.log(`默认管理员账号: admin / admin123`);
});
