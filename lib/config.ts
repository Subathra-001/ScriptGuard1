export const config = {
  apiKey: process.env.SCRIPTGUARD_API_KEY ?? "dev-scriptguard-key",
  teamsWebhookUrl: process.env.TEAMS_WEBHOOK_URL,
  outlookWebhookUrl: process.env.OUTLOOK_WEBHOOK_URL,
  notificationsEnabled: process.env.ENABLE_NOTIFICATIONS !== "false",
};
