CREATE TABLE `diary` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`sake_id` text,
	`created_at` integer NOT NULL,
	`impression` text NOT NULL,
	`price` integer,
	`location` text,
	FOREIGN KEY (`sake_id`) REFERENCES `sake`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sake` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`imageURL` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wish` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`sake_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`sake_id`) REFERENCES `sake`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sake_name_unique` ON `sake` (`name`);