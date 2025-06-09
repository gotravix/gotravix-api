CREATE TYPE "public"."user_roles" AS ENUM('patient', 'clinic', 'lawyer', 'marketer', 'admin');--> statement-breakpoint
CREATE TABLE "activation_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "activation_tokens_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "activation_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "clinics" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"address" varchar(128) NOT NULL,
	"contact_number" varchar(128) NOT NULL,
	"license_number" varchar(32),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"given_name" varchar(128) NOT NULL,
	"middle_name" varchar(128),
	"family_name" varchar(128) NOT NULL,
	"birth_date" date NOT NULL,
	"phone_number" varchar(32),
	"zip_code" varchar(16),
	"state" varchar(64),
	"city" varchar(64),
	"address" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(64),
	"password" varchar(255) NOT NULL,
	"role" "user_roles",
	"active" boolean DEFAULT false NOT NULL,
	"wizard" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "activation_tokens" ADD CONSTRAINT "activation_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;