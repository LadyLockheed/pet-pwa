import styled from 'styled-components';
import { typography } from '../styles/typography';
import BackButton from './BackButton';

interface PageHeaderProps {
	to: string;
	label: string;
	title: string;
}

export default function PageHeader({ to, label, title }: PageHeaderProps) {
	return (
		<Header>
			<BackButton to={to} label={label} />
			<Title>{title}</Title>
			<HeaderSpacer />
		</Header>
	);
}

const Header = styled.header({
	display: 'grid',
	gridTemplateColumns: '50px 1fr 50px',
	alignItems: 'center',
	width: '100%',
	maxWidth: '420px',
});

const Title = styled.h1({
	...typography.screenTitle,
	margin: 0,
	textAlign: 'center',
});

const HeaderSpacer = styled.div({
	width: '50px',
});
