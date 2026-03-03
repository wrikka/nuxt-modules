export const RECEIPT_LAYOUT = {
	width: 80,
	height: 200,
	headerX: 40,
	headerY: 20,
	marginLeft: 10,
	marginRight: 10,
	lineHeight: 5,
} as const

export const TAX_INVOICE_LAYOUT = {
	format: "a4",
	orientation: "portrait" as const,
	marginTop: 20,
	marginBottom: 20,
	marginLeft: 20,
	marginRight: 20,
} as const

export const PDF_STYLES = {
	font: "helvetica",
	headerFontSize: 16,
	bodyFontSize: 10,
	titleFontSize: 20,
} as const
