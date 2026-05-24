import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import styled from 'styled-components';
import { colors } from '../styles/colors';

interface BackButtonProps {
	to: string;
	label: string;
}

export default function BackButton({ to, label }: BackButtonProps) {
	return (
		<ButtonLink to={to} aria-label={label}>
			<MoveLeft size={30} />
		</ButtonLink>
	);
}

const ButtonLink = styled(Link)({
	display: 'grid',
	width: '50px',
	height: '50px',
	placeItems: 'center',
	borderRadius: '8px',
	color: colors.blackBrown,
	fontSize: '1.5rem',
	fontWeight: 800,
	textDecoration: 'none',
});
