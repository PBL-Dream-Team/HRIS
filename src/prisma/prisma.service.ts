import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService){
        super({
            datasources : {
                db: {
                    url : config.get('DB_URL')
                }
            }
        })
    }
    cleanDb() {
        return this.$transaction([
            this.transactionItem.deleteMany(),
            this.transaction.deleteMany(),
            this.book.deleteMany(),
            this.user.deleteMany(),
        ]);
      }
    
}