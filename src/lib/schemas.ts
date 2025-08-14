import z from "zod";

export const BaseProjectSchema = z.object({
	name: z.string(),
	type: z.string(),
	tech_stack: z.array(z.string()),
	thumbnail: z.string().or(z.literal("")),
	link: z.url().or(z.literal("")),
	github_link: z.url().or(z.literal("")),
	images: z.array(z.url()),
});

export const ProjectSchema = BaseProjectSchema.catchall(z.string());

export const BaseAchievementSchema = z.object({
	name: z.string(),
	type: z.string(),
	category: z.string(),
	scope: z.string(),
	skills: z.array(z.string()),
	thumbnail: z.string().or(z.literal("")),
	images: z.array(z.url()),
});

export const AchievementSchema = BaseAchievementSchema.catchall(z.string());

export const SupportedLangSchema = z.object({
	code: z.string(),
	name: z.string(),
	sheetName: z.string(),
});

export const TranslationsSchema = z.record(
	z.string(),
	z.record(z.string(), z.string()),
);

const LanguagesRepoSchema = z.array(
	z.object({
		name: z.string(),
		color: z.string(),
		size: z.number(),
	}),
);

export const ContributionsSchema = z.object({
	profile: z.object({
		username: z.string(),
		name: z.string(),
		avatarUrl: z.string(),
		followers: z.number(),
		following: z.number(),
		totalRepos: z.number(),
	}),
	stats: z.object({
		totalStars: z.number(),
		totalCommits: z.number(),
		totalReviews: z.number(),
		totalPRs: z.number(),
		totalIssues: z.number(),
		contributedTo: z.number(),
		rank: z.object({
			level: z.string(),
			percentile: z.number(),
		}),
	}),
	topLanguages: LanguagesRepoSchema,
	repositories: z.array(
		z.object({
			name: z.string(),
			url: z.url(),
			description: z.string().nullable(),
			stars: z.number(),
			forks: z.number(),
			sizeInKB: z.number(),
			createdAt: z.string(),
			updatedAt: z.string(),
			isPrivate: z.boolean(),
			languages: LanguagesRepoSchema,
		}),
	),
});

export const defaultContributions: Contributions = {
	profile: {
		username: "N/A",
		name: "User Not Found",
		avatarUrl: "",
		followers: 0,
		following: 0,
		totalRepos: 0,
	},
	stats: {
		totalStars: 0,
		totalCommits: 0,
		totalReviews: 0,
		totalPRs: 0,
		totalIssues: 0,
		contributedTo: 0,
		rank: {
			level: "N/A",
			percentile: 0,
		}
	},
	topLanguages: [],
	repositories: [],
};

export type Project = z.infer<typeof ProjectSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type SupportedLang = z.infer<typeof SupportedLangSchema>;
export type Translations = z.infer<typeof TranslationsSchema>;
export type Contributions = z.infer<typeof ContributionsSchema>;
export type LanguagesRepo = z.infer<typeof LanguagesRepoSchema>;