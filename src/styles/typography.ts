import { colors } from './colors';

export const typography = {
	fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
	screenTitle: {
		fontSize: '1.25rem',
		fontWeight: 700,
		lineHeight: 1.2,
		color: colors.blackBrown,
	},
	cardTitle: {
		fontSize: '1rem',
		fontWeight: 700,
		lineHeight: 1.2,
		color: colors.blackBrown,
	},
	body: {
		fontSize: '0.875rem',
		fontWeight: 400,
		lineHeight: 1.35,
		color: colors.blackBrown,
	},
	meta: {
		fontSize: '0.8125rem',
		fontWeight: 400,
		lineHeight: 1.3,
		color: colors.coldBrown,
	},
	value: {
		fontSize: '0.875rem',
		fontWeight: 700,
		lineHeight: 1.35,
		color: colors.blackBrown,
	},
	sectionLabel: {
		fontSize: '0.72rem',
		fontWeight: 700,
		lineHeight: 1.2,
		letterSpacing: '0.12em',
		textTransform: 'uppercase',
		color: colors.orange,
	},
	pill: {
		fontSize: '0.7rem',
		fontWeight: 700,
		lineHeight: 1,
		letterSpacing: '0.04em',
		textTransform: 'uppercase',
	},
} as const;
