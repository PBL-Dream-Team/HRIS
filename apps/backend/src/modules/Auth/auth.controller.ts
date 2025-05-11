import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthEmailDto } from "./dtos";
import { RegDto } from "./dtos";
import { AuthIdDto } from "./dtos";

@Controller('api/auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    signup(@Body() dto: RegDto){
        return this.authService.signUp(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/signin/email')
    email_signin(@Body() dto: AuthEmailDto){
        return this.authService.emailSignIn(dto);
    }
    // @HttpCode(HttpStatus.OK)
    // @Post('signin/id')
    // id_signin(@Body() dto: AuthIdDto){
    //     return this.authService.signin(dto);
    // }

    // @HttpCode(HttpStatus.OK)
    // @Post('signin/google')
    // google_signin(@Body() dto: AuthIdDto){
    //     return this.authService.signin(dto);
    // }
}