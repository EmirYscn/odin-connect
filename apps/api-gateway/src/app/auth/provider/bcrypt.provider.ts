import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(password: string | Buffer): Promise<string> {
    // GENERATE SALT
    const salt = await bcrypt.genSalt();
    // HASH PASSWORD
    return await bcrypt.hash(password, salt);
  }
  public async comparePasswords(
    plainPassword: string | Buffer,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
