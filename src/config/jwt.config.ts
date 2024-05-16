import { JwtModuleAsyncOptions, JwtModuleOptions } from "@nestjs/jwt";
import appConfig from "./app.config";

export const jwtConfig: JwtModuleAsyncOptions = {
    useFactory: () => {
        return {
            secret: appConfig().jwtSecret,
            signOptions: { expiresIn: '4h' },
            global: true
        }
    }
};