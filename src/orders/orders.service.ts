import { 
  HttpStatus, 
  Injectable, 
  Logger, 
  OnModuleInit 
} from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto, OrderPaginationDto } from './dto';

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

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const { page = 1, limit = 10 } = orderPaginationDto;

    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status
      }
    });

    const currentPage = page;
    const perPage = limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status
        }
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage)
      }
    };
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
