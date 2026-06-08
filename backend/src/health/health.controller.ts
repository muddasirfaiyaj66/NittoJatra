import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check' })
  check() {
    return this.health
      .check([async () => this.mongo.pingCheck('mongo')])
      .then((result) => ({
        status: result.status === 'ok' ? 'ok' : 'error',
        mongo: result.details.mongo?.status === 'up' ? 'up' : 'down',
        uptime: Math.floor(process.uptime()),
      }));
  }
}
