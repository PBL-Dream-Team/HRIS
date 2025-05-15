import { SetMetadata } from "@nestjs/common";

export const RequireSubscription = () => SetMetadata('requireSubscrption',true);