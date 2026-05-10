import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';

const navItems: Array<{
	label: string;
	to: string;
}> = [
	{
		label: 'Pet',
		to: '/',
	},
	{
		label: 'Add pet',
		to: '/add-pet',
	},
	{
		label: 'About',
		to: '/about',
	},
];

export default function BottomNav() {
	return (
		<Nav aria-label="Primary navigation">
			<NavInner>
				{navItems.map((item) => (
					<NavLink key={item.to} to={item.to} end={item.to === '/'}>
						{item.label}
					</NavLink>
				))}
			</NavInner>
		</Nav>
	);
}

const Nav = styled.nav({
	position: 'fixed',
	right: 0,
	bottom: 0,
	left: 0,
	zIndex: 10,
	display: 'flex',
	justifyContent: 'center',
	boxSizing: 'border-box',
	padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
	borderTop: '1px solid #d7ded8',
	backgroundColor: '#ffffff',
});

const NavInner = styled.div({
	display: 'grid',
	gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	gap: '4px',
	width: '100%',
	maxWidth: '420px',
});

const NavLink = styled(RouterNavLink)({
	display: 'grid',
	minHeight: '48px',
	placeItems: 'center',
	borderRadius: '8px',
	color: '#2f6f73',
	fontWeight: 800,
	textDecoration: 'none',
	'&.active': {
		backgroundColor: '#dfeee9',
		color: '#28575a',
	},
});
