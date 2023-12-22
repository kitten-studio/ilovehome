export type SubscriptionData = {
	enableIndexes: number[]
	startIndex: number
	endIndex: number
	hasItem: boolean
}

export type Subscription = {
	isSubscribing: boolean
	isCheckedSubscribing: boolean
	isItemSubscribing: boolean
	subscriptionsCount: number
	data: SubscriptionData
	preData: SubscriptionData
	isSubscriptionPopupVisible: boolean
	canVisible: boolean
	isSubscriptionBoxTooltipVisible: boolean
	hasBeenShownSubscriptionBoxTooltip: boolean
}
