import bcrypt from 'bcryptjs';
import { initDatabase, getDatabase, closeDatabase } from './config/database';

async function seed() {
  initDatabase();
  const db = getDatabase();

  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }).count;
  if (userCount > 0) {
    console.log('数据库已有数据，跳过种子数据插入');
    closeDatabase();
    return;
  }

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('123456', 10);

  const insertUser = db.prepare('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)');
  insertUser.run('admin', adminPassword, 'admin@copyright.com', 'admin');
  insertUser.run('zhangsan', userPassword, 'zhangsan@example.com', 'user');
  insertUser.run('lisi', userPassword, 'lisi@example.com', 'user');
  insertUser.run('wangwu', userPassword, 'wangwu@example.com', 'user');
  insertUser.run('zhaoliu', userPassword, 'zhaoliu@example.com', 'user');

  const insertWork = db.prepare('INSERT INTO works (title, type, description, author_id, status) VALUES (?, ?, ?, ?, ?)');
  insertWork.run('《星际迷途》科幻小说', '稿件', '一部关于星际探索的科幻长篇小说，讲述人类在宇宙深处的冒险故事', 2, '已确权');
  insertWork.run('《春日花园》水彩插画', '插画', '春日花园主题水彩插画系列，共12幅', 3, '已确权');
  insertWork.run('《城市之光》纪录片', '影音', '记录中国五座城市夜景的纪录片，时长90分钟', 2, '已登记');
  insertWork.run('《数据结构与算法》教材', '稿件', '面向高校计算机专业的数据结构与算法教材', 4, '已确权');
  insertWork.run('《山海经异兽录》概念设计', '插画', '基于山海经的异兽概念设计图集，共30幅', 3, '草稿');
  insertWork.run('《编程之道》有声书', '影音', '技术类有声读物，讲述程序员成长之路', 5, '已确权');
  insertWork.run('《量子计算入门》科普文章', '稿件', '面向大众的量子计算科普系列文章', 4, '已登记');
  insertWork.run('《未来城市》3D渲染图', '插画', '未来主义城市建筑3D渲染作品集', 2, '已确权');
  insertWork.run('《深海探秘》短视频', '影音', '深海生物纪录短视频系列，共8集', 5, '草稿');
  insertWork.run('《AI绘画指南》教程', '稿件', 'AI辅助绘画技术教程与案例分析', 3, '已驳回');

  const insertCopyright = db.prepare('INSERT INTO copyrights (work_id, registration_number, status, registration_date, certificate_hash, confirmed_at, reviewer_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertCopyright.run(1, 'CR-20250101-0001', '已确权', '2025-01-15 10:30:00', 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', '2025-01-20 14:00:00', 1);
  insertCopyright.run(2, 'CR-20250102-0002', '已确权', '2025-01-18 09:00:00', 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', '2025-01-22 16:30:00', 1);
  insertCopyright.run(3, 'CR-20250201-0003', '待审核', '2025-02-05 11:20:00', 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', null, null);
  insertCopyright.run(4, 'CR-20250210-0004', '已确权', '2025-02-12 08:45:00', 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', '2025-02-18 10:00:00', 1);
  insertCopyright.run(6, 'CR-20250301-0005', '已确权', '2025-03-05 14:10:00', 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', '2025-03-10 09:30:00', 1);
  insertCopyright.run(7, 'CR-20250315-0006', '待审核', '2025-03-18 16:00:00', 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1', null, null);
  insertCopyright.run(8, 'CR-20250401-0007', '已确权', '2025-04-02 10:00:00', '1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b', '2025-04-08 11:15:00', 1);
  insertCopyright.run(10, 'CR-20250420-0008', '已驳回', '2025-04-22 13:30:00', '2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c', '2025-04-28 15:45:00', 1);

  const insertContract = db.prepare('INSERT INTO contracts (work_id, licensee, contract_type, start_date, end_date, revenue_share, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertContract.run(1, '星辰阅读平台', '独家授权', '2025-02-01', '2026-01-31', 0.6, '生效中');
  insertContract.run(2, '花瓣创意设计', '非独家授权', '2025-03-01', '2025-12-31', 0.5, '生效中');
  insertContract.run(4, '清华大学出版社', '出版授权', '2025-01-01', '2027-12-31', 0.7, '生效中');
  insertContract.run(6, '喜马拉雅FM', '音频授权', '2025-04-01', '2026-03-31', 0.55, '生效中');
  insertContract.run(8, '视觉中国', '图库授权', '2025-05-01', '2026-04-30', 0.45, '草稿');
  insertContract.run(1, '海外出版集团', '海外发行', '2024-06-01', '2025-05-31', 0.5, '已到期');
  insertContract.run(3, '优酷视频', '视频授权', '2025-06-01', '2026-05-31', 0.5, '草稿');

  const insertRevenue = db.prepare('INSERT INTO revenues (contract_id, amount, period, status, settled_at) VALUES (?, ?, ?, ?, ?)');
  insertRevenue.run(1, 15000.00, '2025年2月', '已结算', '2025-03-05 10:00:00');
  insertRevenue.run(1, 18200.00, '2025年3月', '已结算', '2025-04-05 10:00:00');
  insertRevenue.run(1, 16500.00, '2025年4月', '待结算', null);
  insertRevenue.run(2, 8500.00, '2025年3月', '已结算', '2025-04-10 10:00:00');
  insertRevenue.run(2, 9200.00, '2025年4月', '待结算', null);
  insertRevenue.run(3, 45000.00, '2025年Q1', '已结算', '2025-04-15 10:00:00');
  insertRevenue.run(3, 38000.00, '2025年Q2', '待结算', null);
  insertRevenue.run(4, 12000.00, '2025年4月', '已结算', '2025-05-05 10:00:00');
  insertRevenue.run(4, 13500.00, '2025年5月', '待结算', null);
  insertRevenue.run(6, 25000.00, '2024年Q3', '已结算', '2024-10-10 10:00:00');
  insertRevenue.run(6, 22000.00, '2024年Q4', '已结算', '2025-01-10 10:00:00');

  console.log('种子数据插入完成');
  console.log('默认账号：admin / admin123');
  closeDatabase();
}

seed().catch(err => {
  console.error('种子数据插入失败:', err);
  process.exit(1);
});
