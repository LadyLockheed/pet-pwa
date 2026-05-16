import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface BackButtonProps {
	to: string;
	label: string;
}

export default function BackButton({ to, label }: BackButtonProps) {
	return (
		<ButtonLink to={to} aria-label={label}>
			&larr;
		</ButtonLink>
	);
}

const ButtonLink = styled(Link)({
	display: 'grid',
	width: '40px',
	height: '40px',
	placeItems: 'center',
	borderRadius: '8px',
	backgroundColor: '#dfeee9',
	color: '#28575a',
	fontSize: '1.5rem',
	fontWeight: 800,
	textDecoration: 'none',
});
