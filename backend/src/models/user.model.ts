import db from '../db';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export const UserModel = {
  findByEmail(email: string): User | undefined {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
  },
  findById(id: number): Omit<User, 'password_hash'> | undefined {
    return db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(id) as Omit<User, 'password_hash'> | undefined;
  },
};
