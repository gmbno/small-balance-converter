import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EtherscanService } from './services/etherscan.service';
import { CacheModule } from '@nestjs/cache-manager';
import { DextoolsService } from './services/dextools.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [EtherscanService, DextoolsService],
})
export class AppModule {}
