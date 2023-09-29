import {
  ConfigResourceTypes,
  IResourceConfigEntry,
  ITopicPartitionConfig,
} from '@nestjs/microservices/external/kafka.interface';
import { Kafka } from 'kafkajs';

export class KafkaAdmin {
  private readonly admin;

  constructor(private readonly broker: string[]) {
    this.admin = new Kafka({
      brokers: this.broker,
    }).admin();
  }

  async connect() {
    await this.admin.connect();
  }

  async alterConfigs(topic: string, configEntries: IResourceConfigEntry[]) {
    await this.admin.alterConfigs({
      validateOnly: false,
      resources: [
        {
          type: ConfigResourceTypes.TOPIC,
          name: topic,
          configEntries: configEntries,
        },
      ],
    });
  }

  async createPartitions(topicPartitions: ITopicPartitionConfig[]) {
    await this.admin.createPartitions({
      validateOnly: false,
      topicPartitions: topicPartitions,
    });
  }

  async disconnect() {
    await this.admin.disconnect();
  }
}
