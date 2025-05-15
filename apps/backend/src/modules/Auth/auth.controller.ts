import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthEmailDto } from "./dtos";
import { RegDto } from "./dtos";
import { AuthIdDto } from "./dtos";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller('api/auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('signup')
    @ApiBody({type:RegDto})
    signup(@Body() dto: RegDto){
        return this.authService.signUp(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/signin/email')
      @ApiBody({type:AuthEmailDto})
    email_signin(@Body() dto: AuthEmailDto){
        return this.authService.emailSignIn(dto);
    }
    @HttpCode(HttpStatus.OK)
    @Post('signin/id')
    @ApiBody({type:AuthIdDto})
    id_signin(@Body() dto: AuthIdDto){
        return this.authService.IdSignIn(dto);
    }

    // @HttpCode(HttpStatus.OK)
    // @Post('signin/google')
    // google_signin(@Body() dto: AuthIdDto){
    //     return this.authService.signin(dto);
    // }
}