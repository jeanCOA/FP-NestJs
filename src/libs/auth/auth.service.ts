import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './utils/hash.service';
import { SignUpDto, LogInDto } from '../dtos/common';
import { JwtPayload, Tokens } from '../types';
import { UserService } from 'src/modules/users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}

  public async logIn(logInDto: LogInDto): Promise<Tokens> {
    const { email, password } = logInDto;
    const user = await this.userService.findOneByEmail(email);

    this.validateUserAndPassword(user, password);

    return this.getTokens({ sub: user.id });
  }

  public async register(userRegister: SignUpDto): Promise<Tokens> {
    const { email, password, username, role } = userRegister;

    await this.validateEmailForSignUp(email);

    const hashedPassword = await this.hashService.hash(password);
    const user = await this.userService.create({ email, username, password: hashedPassword, role });

    return this.getTokens({ sub: user.id });
  }

  private async getTokens(payload: JwtPayload): Promise<Tokens> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET is not set');
    }

    const accessToken = await this.jwtService.signAsync(payload, { secret: secretKey });

    return { access_token: accessToken };
  }

  private async validateUserAndPassword(user: any, password: Partial<LogInDto>): Promise<void> {
    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }
  }

  private async validateEmailForSignUp(email: Partial<SignUpDto>): Promise<void> {
    const user = await this.userService.findOneByEmailRegister(email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }
  }

}
