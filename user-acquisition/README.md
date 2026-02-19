# @wrikka/user-acquisition

Nuxt module for comprehensive user acquisition system including referrals, affiliates, and rewards.

## Features

### Referral System

- **Referral Code Generation**: Unique, secure referral codes
- **Multi-Tier Referrals**: Support for level 1, 2, and 3 referrals
- **Referral Link Tracking**: Track clicks, conversions, and attribution
- **Referrer & Referee Analytics**: Comprehensive tracking for both parties
- **Referral Link Management**: Customizable referral URLs

### Affiliate System

- **Affiliate Registration**: Easy onboarding workflow
- **Commission Tracking**: Percentage-based and fixed-amount commissions
- **Performance Metrics**: Detailed analytics and leaderboards
- **Payout Management**: Automated payout processing
- **Affiliate Dashboard**: Real-time performance tracking

### Rewards System

- **Reward Types**: Points, credits, cash, and discounts
- **Reward Tiers**: Gamification with level progression
- **Redemption System**: Flexible reward redemption
- **Expiration Management**: Time-limited rewards
- **Distribution Rules**: Customizable reward allocation

### Analytics & Integration

- **Comprehensive Analytics**: Detailed dashboards and reports
- **Webhook Support**: Real-time event notifications
- **Email Notifications**: Automated communication
- **API Endpoints**: Full REST API for integrations

## Installation

```bash
bun add @wrikka/user-acquisition
```

## Usage

Add module to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
	modules: ["@wrikka/user-acquisition"],
	userAcquisition: {
		referral: {
			enabled: true,
			tiers: 3,
			defaultReward: 100,
		},
		affiliate: {
			enabled: true,
			commissionRate: 0.1,
		},
		rewards: {
			enabled: true,
			expirationDays: 365,
		},
	},
})
```

## License

MIT
