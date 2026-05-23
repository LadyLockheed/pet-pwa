import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { spacings } from '../styles/spacings';
import { typography } from '../styles/typography';

interface CollapsibleSectionProps {
	title: string;
	defaultOpen?: boolean;
	className?: string;
	children: ReactNode;
}

export default function CollapsibleSection({
	title,
	defaultOpen = false,
	className,
	children,
}: CollapsibleSectionProps) {
	return (
		<Section open={defaultOpen} className={className}>
			<summary>
				<span>{title}</span>
				<SectionLine />
				<ChevronDown className="section-chevron section-chevron-down" />
				<ChevronUp className="section-chevron section-chevron-up" />
			</summary>
			<SectionContent>{children}</SectionContent>
		</Section>
	);
}

const Section = styled.details({
	position: 'relative',
	width: '100%',
	paddingTop: spacings.x3,
	'& summary': {
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		...typography.sectionLabel,
		listStyle: 'none',
		color: colors.orange,
	},
	'& summary::-webkit-details-marker': {
		display: 'none',
	},
	'& .section-chevron': {
		width: '18px',
		height: '18px',
		flexShrink: 0,
		color: colors.warmBrown,
	},
	'& .section-chevron-up': {
		display: 'none',
	},
	'&[open] .section-chevron-down': {
		display: 'none',
	},
	'&[open] .section-chevron-up': {
		display: 'block',
	},
});

const SectionLine = styled.span({
	flex: 1,
	height: '1px',
	marginLeft: spacings.x2,
	marginRight: spacings.x2,
	backgroundColor: colors.warmBrown,
});

const SectionContent = styled.div({
	display: 'grid',
	gap: spacings.x4,
	marginTop: spacings.x3,
	border: `1px solid ${colors.darkBeige}`,
	borderRadius: '4px',
	backgroundColor: '#fbf8f4',
	padding: spacings.x3,
});
