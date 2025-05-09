import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "../../common";
import { OrderStatus } from "@prisma/client";
import { OrderStatusList } from "../enums";

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum( OrderStatusList, {
    message: `Valid status are ${OrderStatusList}`
  })
  status: OrderStatus;
}
