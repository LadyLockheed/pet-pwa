import { useState, type ReactNode } from 'react';
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
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<Section
			open={isOpen}
			className={className}
			onToggle={(event) => setIsOpen(event.currentTarget.open)}
		>
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
	paddingTop: spacings.x4,
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
		color: colors.orange,
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
	backgroundColor: colors.orange,
});

const SectionContent = styled.div({
	display: 'grid',
	gap: spacings.x4,
	marginTop: spacings.x3,
	borderRadius: '8px',
});
