import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt,Strategy,} from 'passport-jwt';
import { PrismaService } from "../../../prisma/prisma.service";
import { Request } from "express";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    return req.cookies?.jwt || null;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey : config.get('JWT_SECRET')
        })
    }

    async validate (payload : {
        sub: string;
        company_id : string;
        is_admin : boolean;
    }){
        let user = await this.prisma.employee.findUnique({
            where : {
                id: payload.sub
            }
        });

        return user;
    }
}