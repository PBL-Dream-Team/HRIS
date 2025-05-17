import { Body, Controller, HttpCode, HttpStatus, Post, Res} from "@nestjs/common";
import { Response } from "express";
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
    async email_signin(@Body() dto: AuthEmailDto, @Res({passthrough: true}) res: Response){
        const token = await this.authService.emailSignIn(dto);

        res.cookie('jwt',token['access_token'],{ //One of my most embarassing logical lapse, can't believe it made me revise my code for hours
            httpOnly: true,
            secure:true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return {
            statusCode: 200,
            message: "Login successfully"
        }
    }
    @HttpCode(HttpStatus.OK)
    @Post('signin/id')
    @ApiBody({type:AuthIdDto})
    async id_signin(@Body() dto: AuthIdDto, @Res({passthrough: true}) res: Response){
        const token = await this.authService.IdSignIn(dto);

        res.cookie('jwt',token['access_token'],{
            httpOnly: true,
            secure:true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return {
            statusCode: 200,
            message: "Login successfully"
        }
    }

    // @HttpCode(HttpStatus.OK)
    // @Post('signin/google')
    // google_signin(@Body() dto: AuthIdDto){
    //     return this.authService.signin(dto);
    // }
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Res({ passthrough:true }) res : Response){
        res.clearCookie('hris_jwt');
        return {
            statusCode: 204,
            message: "Logged Out"
        };
    }
}