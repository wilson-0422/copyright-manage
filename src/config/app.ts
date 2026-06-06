import express from 'express';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import path from 'path';

const SQLiteStoreSession = SQLiteStore(session);

export function createApp(): express.Application {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(session({
    store: new SQLiteStoreSession({
      db: 'sessions.db',
      dir: path.join(__dirname, '..', '..'),
    }) as session.Store,
    secret: 'copyright-manage-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  }));

  return app;
}
