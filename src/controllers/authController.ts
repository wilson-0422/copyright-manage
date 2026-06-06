import { Request, Response } from 'express';
import * as UserService from '../services/userService';

export function showLogin(req: Request, res: Response) {
  res.render('auth/login', { error: null });
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const user = await UserService.authenticate(username, password);

    if (!user) {
      return res.render('auth/login', { error: '用户名或密码错误' });
    }

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err: any) {
    res.render('auth/login', { error: err.message });
  }
}

export function showRegister(req: Request, res: Response) {
  res.render('auth/register', { error: null });
}

export async function register(req: Request, res: Response) {
  try {
    const { username, password, email } = req.body;
    const user = await UserService.registerUser(username, password, email);

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err: any) {
    res.render('auth/register', { error: err.message });
  }
}

export function logout(req: Request, res: Response) {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
}
