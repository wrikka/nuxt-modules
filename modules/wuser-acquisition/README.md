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

### 🆕 Double-Sided Rewards

- **Win-Win Incentives**: Both referrer and referee receive rewards
- **Configurable Rewards**: Customize reward types and amounts for each side
- **Milestone Bonuses**: Extra rewards at referral milestones (5, 10, 25, etc.)
- **Payment Integration**: Seamless integration with @wrikka/wpayment for reward distribution

### 🆕 Referral Contests & Gamification

- **Contest Management**: Create and manage referral competitions
- **Real-time Leaderboards**: Live ranking with podium display
- **Gamification Badges**: Achievement system with unlockable badges
- **Prize Distribution**: Automatic prize allocation for winners

### 🆕 Smart Referral Matching

- **AI-Powered Matching**: Intelligent user matching based on network, interests, and behavior
- **Match Scoring**: Confidence scores with detailed reasoning
- **Auto-Suggestions**: Automatic recommendations for high-potential referrals
- **Contact Management**: Track outreach and conversion status

### 🆕 Affiliate Coupon Codes

- **Stripe Integration**: Full integration with @wrikka/wpayment coupon system
- **Custom Codes**: Allow affiliates to create branded discount codes
- **Usage Tracking**: Track revenue and conversions per coupon
- **Automatic Commission**: Auto-calculate affiliate commission on coupon usage

### 🆕 Referral Retargeting

- **Funnel Tracking**: Monitor referral journey from click to conversion
- **Abandonment Recovery**: Automatic re-engagement for incomplete referrals
- **Multi-Channel Campaigns**: Email, push, SMS, and in-app retargeting
- **A/B Testing**: Test different messaging and timing strategies

### Analytics & Integration

- **Comprehensive Analytics**: Detailed dashboards and reports
- **Webhook Support**: Real-time event notifications
- **Email Notifications**: Automated communication
- **API Endpoints**: Full REST API for integrations
- **Payment Integration**: Native support for @wrikka/wpayment

## Installation

```bash
bun add @wrikka/user-acquisition
```

Optional: Install with payment integration:
```bash
bun add @wrikka/user-acquisition @wrikka/wpayment
```

## Usage

Add module to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
	modules: ["@wrikka/user-acquisition", "@wrikka/wpayment"],
	wpayment: {
		publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
	},
	userAcquisition: {
		referral: {
			enabled: true,
			tiers: 3,
			defaultReward: 100,
		},
		doubleSidedRewards: {
			enabled: true,
			referrerReward: {
				type: "points",
				amount: 100,
			},
			refereeReward: {
				type: "discount",
				amount: 20,
				welcomeBonus: true,
			},
		},
		affiliate: {
			enabled: true,
			commissionRate: 0.1,
		},
		affiliateCoupons: {
			enabled: true,
			allowCustomCodes: true,
			maxCouponsPerAffiliate: 5,
			defaultDiscountType: "percentage",
			defaultDiscountValue: 10,
		},
		referralContests: {
			enabled: true,
			autoStart: true,
		},
		smartMatching: {
			enabled: true,
			minMatchScore: 70,
			autoSuggest: true,
		},
		retargeting: {
			enabled: true,
			defaultDelay: 24,
			trackFunnelStages: true,
		},
		rewards: {
			enabled: true,
			expirationDays: 365,
		},
	},
})
```

## Components

### DoubleSidedRewards
Display and claim double-sided rewards:

```vue
<DoubleSidedRewards 
  :user-id="currentUser.id" 
  :referral-id="activeReferralId"
/>
```

### ReferralContests
Show active contests and leaderboards:

```vue
<ReferralContests :user-id="currentUser.id" />
```

### SmartReferralMatching
AI-powered referral suggestions:

```vue
<SmartReferralMatching :user-id="currentUser.id" />
```

### AffiliateCoupons
Manage affiliate coupon codes (with wpayment integration):

```vue
<AffiliateCoupons :affiliate-id="currentAffiliate.id" />
```

### ReferralRetargeting
Monitor funnels and manage retargeting campaigns:

```vue
<ReferralRetargeting :user-id="currentUser.id" />
```

## Composables

### useDoubleSidedRewards
```typescript
const { 
  createDoubleSidedReward, 
  claimReferrerReward, 
  claimRefereeReward,
  getUnclaimedRewards 
} = useDoubleSidedRewards()
```

### useReferralContests
```typescript
const { 
  activeContests, 
  currentLeaderboard,
  joinContest, 
  calculateGamificationScore 
} = useReferralContests()
```

### useSmartReferralMatching
```typescript
const { 
  potentialMatches, 
  calculateUserPotential,
  contactPotentialReferee 
} = useSmartReferralMatching()
```

### useAffiliateCoupons
```typescript
const { 
  createStripeLinkedCoupon,
  validateAffiliateCoupon,
  trackCouponUsage 
} = useAffiliateCoupons()
```

### useAffiliateCouponPayment (wpayment integration)
```typescript
const { 
  createStripeCoupon,
  validateAndApplyCoupon,
  trackCouponUsage 
} = useAffiliateCouponPayment()
```

### useReferralRetargeting
```typescript
const { 
  trackFunnelProgress,
  createRetargetingCampaign,
  getAbandonedFunnels 
} = useReferralRetargeting()
```

## Payment Integration

This module integrates seamlessly with `@wrikka/wpayment` for:
- Coupon code creation and management via Stripe
- Automatic reward distribution
- Affiliate commission tracking
- Payment-based referral validation

See `@wrikka/wpayment` documentation for payment setup details.

## License

MIT
