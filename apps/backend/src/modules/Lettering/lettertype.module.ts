import { Module } from "@nestjs/common";
import { LetterTypeController } from "./lettertype.controller";
import { LetterTypeService } from "./lettertype.service";

@Module({
    providers:[LetterTypeService],
    controllers:[LetterTypeController]
})
export class LetterTypeModule {}