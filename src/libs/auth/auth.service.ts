import { JwtService } from '@nestjs/jwt';
import { HashService } from './utils/hash.service';
import { SignUpDto, LogInDto } from '../dtos/common';
import { JwtPayload, Tokens } from '../types';
import { UserService } from 'src/modules/users/services/users.service';
import { Injectable, BadRequestException } from '@nestjs/common';

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

  public async logOut(): Promise<Tokens> {
    const emptyToken = await this.getTokens({ sub: null });
    if (!emptyToken) {
      throw new BadRequestException('No active session to log out from');
    }

    const logoutTokenDuration = '5s';
    const remainingSeconds = this.calculateRemainingTime(emptyToken.expirationDate);

    if (remainingSeconds <= 5) {
      console.log(`Logging out in ${remainingSeconds} seconds...`);
    }

    const token = await this.getTokens({ sub: null }, logoutTokenDuration); 
    return token;
  }

  public async signUp(userSignUp: SignUpDto): Promise<Tokens> {
    const { email, password, username, role } = userSignUp;
    await this.validateEmailForSignUp(email);
    const hashedPassword = await this.hashService.hash(password);
    const user = await this.userService.create({ email, username, password: hashedPassword, role });
    return this.getTokens({ sub: user.id });
  }

  private async getTokens(payload: JwtPayload, expiresIn?: string): Promise<Tokens> {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      throw new Error('JWT_SECRET is not set');
    }

    const options = { secret: secretKey };
    if (expiresIn) {
      options['expiresIn'] = expiresIn;
    }

    const accessToken = await this.jwtService.signAsync(payload, options);
    return { access_token: accessToken };
  }

  private calculateRemainingTime(expirationDate: Date): number {
    const remainingMilliseconds = expirationDate.getTime() - Date.now();
    return Math.ceil(remainingMilliseconds / 1000);
  }

  private async validateUserAndPassword(user: Partial<LogInDto>, password: Partial<LogInDto>): Promise<void> {
    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }
  }

  private async validateEmailForSignUp(email: Partial<SignUpDto>): Promise<void> {
    const user = await this.userService.findOneByEmailSignUp(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
  }
}
