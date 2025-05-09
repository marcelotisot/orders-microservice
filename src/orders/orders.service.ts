import { 
  HttpStatus, 
  Injectable, 
  Logger, 
  OnModuleInit 
} from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  create(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: createOrderDto
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id }
    });

    if(!order) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `Order with id ${id} not found`
      });
    }
    
    return order;
  }

}
