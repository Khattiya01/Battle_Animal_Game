CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT 'a30df1b3-6514-4136-8bd1-30d0e4d1b493' NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"is_active" boolean DEFAULT true,
	"role" varchar NOT NULL,
	"term" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT 'deed91db-1adc-4958-8237-dba1e2050757' NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"count_play" numeric,
	"image_url" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "games_name_unique" UNIQUE("name")
);
