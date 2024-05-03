import { applyDecorators, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guard/auth.guard";
import { ResourceGuard } from "../guard/resource.guard";
import { Resource } from "./resource.decorator";


export function Auth(name: string) {
  return applyDecorators(
    Resource(name),
    UseGuards(AuthGuard, ResourceGuard)
  );
}