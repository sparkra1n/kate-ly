import { CommandInteraction } from 'discord.js';
import fs from 'fs/promises';

class InteractionLogger {
  private uniqueUserIds: Set<string>;
  private filePath: string;

  constructor(filePath: string) {
    this.uniqueUserIds = new Set<string>();
    this.filePath = filePath;
    this.loadUserData();
  }

  private async loadUserData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.uniqueUserIds = new Set(JSON.parse(data));
    } catch (error) {
      console.error('Error loading user IDs:', error);
    }
  }

  private async saveUserData() {
    try {
      const data = JSON.stringify(Array.from(this.uniqueUserIds));
      await fs.writeFile(this.filePath, data, 'utf-8');
    } catch (error) {
      console.error('Error saving user IDs:', error);
    }
  }

  public async logInteraction(interaction: CommandInteraction) {
    this.uniqueUserIds.add(interaction.user.id);
    await this.saveUserData();
  }
}

export default InteractionLogger;
