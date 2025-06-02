import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  Query,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthEmailDto } from './dtos';
import { RegDto } from './dtos';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { GoogleDto } from './dtos/google.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: RegDto })
  signup(@Body() dto: RegDto) {
    return this.authService.signUp(dto);
  }

  @Post('/signin/email')
  @ApiBody({ type: AuthEmailDto })
  async email_signin(
    @Body() dto: AuthEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.emailSignIn(dto);

    if (token['access_token'] != null) {
      res.cookie('jwt', token['access_token'], {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.cookie('jwt_refresh', token['refresh_token'], {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/api/auth/refresh'
      });

      return {
        statusCode: 200,
        message: 'Login successfully',
      };
    } else {
      throw {
        statusCode: token['statusCode'],
        message: token['message'],
      };
    }
  }
  // @Post('signin/id')
  // @ApiBody({type:AuthIdDto})
  // async id_signin(@Body() dto: AuthIdDto, @Res({passthrough: true}) res: Response){
  //     const token = await this.authService.IdSignIn(dto);

  //     res.cookie('jwt',token['access_token'],{
  //         httpOnly: true,
  //         secure:true,
  //         sameSite: 'none',
  //         maxAge: 1000 * 60 * 60 * 24 * 7,
  //     });

  //     return {
  //         statusCode: 200,
  //         message: "Login successfully"
  //     }
  // }

  // @HttpCode(HttpStatus.OK)
  // @Post('signin/google')
  // google_signin(@Body() dto: AuthIdDto){
  //     return this.authService.signin(dto);
  // }
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response,@Req() req: Request) {
    res.clearCookie('jwt');

    this.authService.removeRefreshToken(req.cookies['jwt_refresh']);

    res.clearCookie('jwt_refresh')
    return {
      statusCode: 204,
      message: 'Logged Out',
    };
  }

  @Get('reset-password')
  async validateToken(@Query('token') token: string) {
    const isValid = await this.authService.validateResetToken(token);

    if (!isValid) {
      throw new ForbiddenException('Token expired or invalid');
    }

    return {
      statusCode: 200,
      message: 'Token is valid',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.new_password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('google')
  async googleSignin(
    @Body() dto: GoogleDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.googleLogin(dto.idToken);

    if (token['access_token'] != null) {
      res.cookie('jwt', token['access_token'], {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return {
        statusCode: 200,
        message: 'Login successfully',
      };
    } else {
      throw {
        statusCode: token['statusCode'],
        message: token['message'],
      };
    }
  }

  @Post('refresh')
  async tokenRefresh(@Req() req: Request, @Res() res: Response){
    const token = req.cookies['jwt_refresh'];

    const newToken = this.authService.tokenRefresh(token);

    if (newToken['access_token'] != null) {
      res.cookie('jwt', token['access_token'], {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.cookie('jwt_refresh', newToken['refresh_token'], {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.COOKIE_DOMAIN || 'localhost',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/api/auth/refresh'
      });

      return {
        statusCode: 200,
        message: 'Token refresh successful',
      };
    } else {
      throw {
        statusCode: token['statusCode'],
        message: token['message'],
      };
    }
  }
}
