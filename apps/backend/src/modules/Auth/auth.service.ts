import { ForbiddenException, Injectable, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from '../../prisma/prisma.service';
import { AuthEmailDto } from "./dtos/authEmail.dto";
import { hash, verify } from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RegDto } from "./dtos/reg.dto";
import { AuthIdDto } from "./dtos";
import { CompanySubscriptionStatus } from "./dtos/CompanySubscriptionStatus.enum";


@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService,
        private jwt :JwtService,
        private config: ConfigService
    ){}

    async signToken(
        userId: string,
        company_id: string,
        is_admin: boolean
    ): Promise<{ access_token : string}>
    {
        const payload = {
            sub: userId,
            company_id,
            is_admin
        }

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(
            payload,
            {
                expiresIn : '20m',
                secret: secret
            }
        );

        return {
            access_token: token
        };
    };
    async signUp(dto: RegDto){
        let companyData: any = {};
        let userData: any = {};

        //Company
        if(dto.name) companyData.name = dto.name;
        companyData.max_employee = 10;
        const trial = await this.prisma.subscription.findFirst({where:{name:'Trial'}});
        companyData.subscription_id = trial.id;
        let now = new Date()
        companyData.subs_date_start = now.toISOString();
        companyData.subs_date_end = new Date(now.getDate() + 14).toISOString();
        companyData.status = CompanySubscriptionStatus.ACTIVE;
        //Employee
        if(dto.first_name) userData.first_name = dto.first_name;
        if(dto.last_name) userData.last_name = dto.last_name;
        if(dto.email) userData.email = dto.email;
        if(dto.password) userData.password = await hash(dto.password);
        userData.is_admin = true;
        
        try{
            const company = await this.prisma.company.create({
                data : companyData
            });

            if(company.id) userData.company_id = company.id;

            const user = await this.prisma.employee.create({data : userData});
            return {
                statusCode: 201,
                message: "Registration Successful"
            }
        }
        catch(error){
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            }
        }

    };
    async emailSignIn(dto: AuthEmailDto){
        try{
            const employee = await this.prisma.employee.findFirst({
                 where: {
                    OR : [
                        {email: dto.input},
                        {phone: dto.input}
                    ]
                }
                });

            if(employee == null || await verify(employee.password,dto.password) == false){
                return {
                    statusCode: 401,
                    message: "Credentials Incorrect"
                }
            }
            else{
                const token = await this.signToken(employee.id, employee.company_id,employee.is_admin);

                return token;
            }
        }
        catch(error){
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            }
        }
    }
    async IdSignIn(dto: AuthIdDto){
        try {
            const employee = await this.prisma.employee.findFirst({
                 where: {
                    OR : [
                        {id: dto.id},
                    ]
                }
                });

            if(employee == null || await verify(employee.password,dto.password) == false){
                throw new ForbiddenException(
                    'Credentials Incorrect'
                );
            }
            else{
                const token = await this.signToken(employee.id, employee.company_id,employee.is_admin);
                return token;
            }
        }
        catch(error){
            console.log("Error: ", error);
            return {
                statusCode: error.code,
                message: error.message
            }
        }
        
    }
}