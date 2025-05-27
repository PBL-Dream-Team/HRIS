import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { CommonModule } from "../../common/mail/mail.module";


@Module({
    imports: [JwtModule.register({}), CommonModule],
     controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
   
})
export class AuthModule{}