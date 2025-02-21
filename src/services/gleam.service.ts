import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaRepository } from 'repositories';
import { gleamCampaignKey } from 'config/gleam';

@Injectable()
export class GleamService {
  private readonly gleamCallbacksRepository: Prisma.GleamCallbackDelegate<Prisma.RejectOnNotFound>;

  constructor(prismaRepository: PrismaRepository) {
    this.gleamCallbacksRepository = prismaRepository.gleamCallback;
  }

  public async saveCallback(
    info: Prisma.GleamCallbackUncheckedCreateInput
  ): Promise<void> {
    await this.gleamCallbacksRepository.create({
      data: info
    });
  }

  public verifyCallback(campaignKey: string): boolean {
    return campaignKey === gleamCampaignKey;
  }
}
