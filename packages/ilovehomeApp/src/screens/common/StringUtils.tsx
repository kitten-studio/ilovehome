export const numberWithCommas = (price: number) => {
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const countDigits = (price: number) => {
	return Math.ceil(price / 10) * 10
}
