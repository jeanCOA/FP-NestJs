import { AuthService } from './auth.service';
import { Controller, Post, Body } from '@nestjs/common';
import { LogInDto, SignUpDto } from '';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate user' })
  @ApiCreatedResponse({ description: 'User successfully logged in' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('login')
  login(@Body() dto: LogInDto) {
    return this.authService.logIn(dto);
  }

  @ApiOperation({ summary: 'Log out user' })
  @ApiCreatedResponse({ description: 'User successfully logged out' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('logout')
  async logOut(): Promise<{ access_token: string }> {
    const token = await this.authService.logOut();
    return token;
  }

  @ApiOperation({ summary: 'Sign up user' })
  @ApiCreatedResponse({ description: 'User successfully registered' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

}
