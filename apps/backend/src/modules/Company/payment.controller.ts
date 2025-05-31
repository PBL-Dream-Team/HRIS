import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";

@Controller('api/payment')
export class PaymentController{
    constructor(private readonly PaymentService: PaymentService){}

    @Post('/callback')
    gatewayCallback(@Body() req: any){
        return this.PaymentService.tripayCallbackHandler(req);
    }
}