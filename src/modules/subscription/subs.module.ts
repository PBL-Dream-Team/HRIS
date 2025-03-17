import { Module } from "@nestjs/common";
import { SubsService } from "./subs.service";
import { SubsController } from "./subs.controller";

@Module({
    providers: [SubsService],
    controllers: [SubsController]
})
export class SubsModule {}