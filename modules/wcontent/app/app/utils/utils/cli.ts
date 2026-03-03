// import type { ContentItem } from "../../../shared/types";

export interface CLICommand {
	name: string;
	description: string;
	aliases?: string[];
	examples?: string[];
	handler: (args: string[]) => Promise<void>;
}

export class ContentCLI {
	private commands: Map<string, CLICommand> = new Map();

	register(command: CLICommand): void {
		this.commands.set(command.name, command);

		// Register aliases
		if (command.aliases) {
			for (const alias of command.aliases) {
				this.commands.set(alias, command);
			}
		}
	}

	async execute(commandName: string, args: string[] = []): Promise<void> {
		const command = this.commands.get(commandName);

		if (!command) {
			console.error(`Command not found: ${commandName}`);
			return;
		}

		try {
			await command.handler(args);
		} catch (error) {
			console.error(`Error executing command: ${commandName}`);
			console.error(error);
		}
	}

	getCommands(): CLICommand[] {
		return Array.from(this.commands.values());
	}

	getCommandNames(): string[] {
		return Array.from(this.commands.keys());
	}

	hasCommand(name: string): boolean {
		return this.commands.has(name);
	}

	help(commandName?: string): void {
		if (commandName) {
			const command = this.commands.get(commandName);

			if (!command) {
				console.log(`Command not found: ${commandName}`);
				return;
			}

			console.log(`Command: ${command.name}`);
			console.log(`Description: ${command.description}`);

			if (command.aliases && command.aliases.length > 0) {
				console.log(`Aliases: ${command.aliases.join(", ")}`);
			}

			if (command.examples && command.examples.length > 0) {
				console.log("Examples:");
				for (const example of command.examples) {
					console.log(`  ${example}`);
				}
			}
		} else {
			console.log("Available commands:");

			for (const command of this.getCommands()) {
				console.log(
					`  ${command.name}${
						command.aliases && command.aliases.length > 0 ? ` (${command.aliases.join(", ")})` : ""
					}: ${command.description}`,
				);
			}
		}
	}
}

let cliInstance: ContentCLI | null = null;

export function getContentCLI(): ContentCLI {
	if (!cliInstance) {
		cliInstance = new ContentCLI();
		cliInstance.register({
			name: "content:generate",
			description: "Generate new content item",
			aliases: ["content:new"],
			examples: [
				"content:generate blog \"My First Post\"",
				"content:generate course \"My Course\"",
			],
			handler: async (args: string[]) => {
				const type = args[0];
				const title = args[1];

				if (!type || !title) {
					console.error("Usage: content:generate <type> <title>");
					return;
				}

				console.log(`Generating ${type} content: ${title}`);
				// In real implementation, would create the file
			},
		});

		cliInstance.register({
			name: "content:validate",
			description: "Validate content items",
			handler: async () => {
				console.log("Validating content items...");
				// In real implementation, would validate all content
			},
		});

		cliInstance.register({
			name: "content:export",
			description: "Export content to JSON",
			handler: async () => {
				console.log("Exporting content...");
				// In real implementation, would export all content
			},
		});

		cliInstance.register({
			name: "content:import",
			description: "Import content from JSON",
			handler: async () => {
				console.log("Importing content...");
				// In real implementation, would import content
			},
		});

		cliInstance.register({
			name: "content:stats",
			description: "Show content statistics",
			handler: async () => {
				console.log("Content statistics:");
				// In real implementation, would show stats
			},
		});
	}

	return cliInstance;
}
