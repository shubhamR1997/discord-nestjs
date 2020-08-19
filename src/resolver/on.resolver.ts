import { DiscordResolve } from '../interface/discord-resolve';
import { ClientEvents } from 'discord.js';
import { ON_DECORATOR } from '../constant/discord.constant';
import { DiscordClient, OnDecoratorOptions } from '..';
import { DiscordResolveOptions } from '../interface/discord-resolve-options';

export class OnResolver implements DiscordResolve {
  resolve(options: DiscordResolveOptions): void {
    const {discordClient, instance, methodName} = options;
    const metadata: OnDecoratorOptions = Reflect.getMetadata(ON_DECORATOR, instance, methodName);
    if (metadata) {
      discordClient.on(metadata.event, (...data: ClientEvents[keyof ClientEvents]) => {
        if (!this.isAllowGuild(discordClient, data)) {
          return;
        }
        instance[methodName](...data);
      });
    }
  }

  private isAllowGuild(discordClient: DiscordClient, data: any[]): boolean {
    const guild = data.find((item) => !!item && !!item.guild);
    const guildId = !!guild && guild.guild.id;
    if (!!guildId) {
      return discordClient.isAllowGuild(guildId);
    }
    return true;
  }
}
