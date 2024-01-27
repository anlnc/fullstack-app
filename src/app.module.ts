import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ArticleModule } from "./articles/article.module";
import { AuthGuard } from "./auth/auth.guard";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [AuthModule, UserModule, ArticleModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
