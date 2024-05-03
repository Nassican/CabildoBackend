import { Request } from "express"

export interface RequestWithUser extends Request {
    user: {
        num_documento: string,
        roles: string[]
    }
}