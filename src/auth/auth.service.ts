import {
  Inject,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { users } from '../db/schema/users';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE')
    private db: NodePgDatabase<typeof import('../db/schema/users')>,
  ) {}

  async register(name: string, email: string, password: string, role: string) {
    // default role if not provided
    const userRole = role ?? Role.USER;

    if (!Object.values(Role).includes(userRole as Role)) {
      throw new BadRequestException('Invalid role');
    }

    // if role is admin, then he can not register
    if (userRole === Role.ADMIN) {
      throw new BadRequestException('Admin cannot be registered');
    }

    // 1️⃣ Check if user already exists
    const existingUser = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length > 0) {
      throw new BadRequestException('Email already exists');
    }

    // 2️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insert new user and return it
    const [newUser] = await this.db
      .insert(users)
      .values({ name, email, password: hashedPassword, role: userRole })
      .returning(); // returns an array of inserted rows

    return newUser; // single user object
  }

  async login(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' },
    );
    return { token, user };
  }

  async validateUser(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
        id: number;
      };
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id));
      return user || null;
    } catch {
      return null;
    }
  }
}
