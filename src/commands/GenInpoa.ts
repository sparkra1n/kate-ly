import { CommandInteraction, Client, EmbedBuilder } from "discord.js";
import { Command } from "../Command";

export const GenInpoa: Command = {
  data: {
    name: "geninpoa",
    description: "Returns a plausible INPOA and calculates breakdown chance"
  },
  async execute(client: Client, interaction: CommandInteraction) {
    let frontLocomotives: number[] = [];
    let middleLocomotives: number[] = [];
    let backLocomotives: number[] = [];
    let breakdownChance = 0;

    // Determine locomotive positions
    const locomotivePicker = Math.floor(Math.random() * 10) + 1;
    const locomotiveCount = (locomotivePicker <= 5) ? 2 
                        : (locomotivePicker <= 8) ? 3 
                                                  : 4;
    
    switch (locomotiveCount) {
    // Two units; both will be in front
    case 2:
        frontLocomotives = new Array(2).fill(0);
        break;

    case 3:
        const positionPicker3 = Math.floor(Math.random() * 10) + 1;

        // All in front
        if (positionPicker3 <= 7) {
            frontLocomotives = new Array(3).fill(0);
        } 
        
        // Two in front, 1 in middle
        else if (positionPicker3 <= 8) {
            frontLocomotives = new Array(2).fill(0);
            middleLocomotives = new Array(1).fill(0);
        } 
        
        // Two in front, 1 in back
        else {
            frontLocomotives = new Array(2).fill(0);
            backLocomotives = new Array(1).fill(0);
        }
        break;
    case 4:
        const positionPicker4 = Math.floor(Math.random() * 10) + 1;

        // All in front
        if (positionPicker4 <= 4) {
            frontLocomotives = new Array(4).fill(0);
        } 
        
        // Three in front, 1 in middle
        else if (positionPicker4 <= 7) {
            frontLocomotives = new Array(3).fill(0);
            middleLocomotives = new Array(1).fill(0);
        } 
        
        // Three in front, 1 in back
        else if (positionPicker4 <= 9) {
            frontLocomotives = new Array(3).fill(0);
            backLocomotives = new Array(1).fill(0);
        }

        // Two in front, Two in back
        else {
            frontLocomotives = new Array(2).fill(0);
            backLocomotives = new Array(2).fill(0);
        }
        break;
    }

    frontLocomotives = frontLocomotives.map(() => {
        const locomotive = generateLocomotive();
        breakdownChance += locomotive[1];
        return locomotive[0];
    });
    
    middleLocomotives = middleLocomotives.map(() => {
        const locomotive = generateLocomotive();
        breakdownChance += locomotive[1];
        return locomotive[0];
    });
    
    backLocomotives = backLocomotives.map(() => {
        const locomotive = generateLocomotive();
        breakdownChance += locomotive[1];
        return locomotive[0];
    });

    const embed: EmbedBuilder = new EmbedBuilder()
        .setTitle("Generated INPOA")
        .setDescription("Imagine if this comes")
        .setColor("#FFD700");

    embed.addFields( 
        {name: "Front Powers", value: frontLocomotives.join(", ")},
    );

    if (middleLocomotives.length > 0) 
        embed.addFields({ name: "Middle DPU", value: middleLocomotives.join(", ") });

    if (backLocomotives.length > 0) 
        embed.addFields({ name: "Rear DPU", value: backLocomotives.join(", ") });

    embed.addFields({ name: "Breakdown Chance", value: `${breakdownChance.toFixed(1)}%` });
    await interaction.editReply({
      content: "",
      embeds: [embed]
    });
  }
};

/**
 * 
 * @returns locomotive, breakdownChance
 */
function generateLocomotive(): [number, number] {
    const special = [1111, 1943, 1982, 1983, 1988, 1989, 1995, 1996, 1979];
    const superSpecial = [6236, 6290, 6310, 6318, 6367, 6378, 6379, 6707, 7400];
    let breakdownChance = 0;
    let locomotive = 0;
    const picker = Math.floor(Math.random() * 20) + 1;

    if (picker <= 12) {
        const gevo = Math.floor(Math.random() * 4) + 1;
        locomotive = gevo === 4 ? Math.floor(Math.random() * (2569 - 2520 + 1)) + 2520
            : Math.floor(Math.random() * (6887 - 5248 + 1)) + 5248;
        breakdownChance += gevo === 4 ? 0.1 : 0.2;
    }
    
    else if (picker === 15) {
        const patch = Math.floor(Math.random() * 300) + 1;
        locomotive = patch >= 230 ? special[Math.floor(Math.random() * special.length)]
            : Math.floor(Math.random() * (7297 - 7080 + 1)) + 7080;
        breakdownChance += patch >= 230 ? 4 : 0;
    } 
    
    else if (picker >= 13) {
        const heritage = Math.floor(Math.random() * 300) + 1;
        locomotive = heritage >= 210 ? special[Math.floor(Math.random() * special.length)]
            : Math.floor(Math.random() * (8620 - 8309 + 1)) + 8309;
        breakdownChance += heritage >= 210 ? 33 : 25;
    } 
    
    else if (picker <= 19) {
        locomotive = Math.floor(Math.random() * (9099 - 8621 + 1)) + 8621;
        breakdownChance += 13;
    } 
    
    else {
        locomotive = Math.floor(Math.random() * (3099 - 3000 + 1)) + 3000;
        breakdownChance += 5;
    }
    return [locomotive, breakdownChance];
}