import { SetMetadata, applyDecorators } from "@nestjs/common";
import { IS_PUBLIC_KEY } from "./common/constants";

const PublicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY, true);
const PublicAuthSwagger = SetMetadata("swagger/apiSecurity", ["public"]);

export const Public = () => applyDecorators(PublicAuthMiddleware, PublicAuthSwagger);
