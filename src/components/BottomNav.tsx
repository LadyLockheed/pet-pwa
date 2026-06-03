import type { ReactNode } from 'react';
import { CirclePlus, Info, PawPrint } from 'lucide-react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../styles/colors';

const navItems: Array<{
	label: string;
	icon: ReactNode;
	to: string;
}> = [
	{
		label: 'Pet',
		icon: <PawPrint size={20} />,
		to: '/',
	},
	{
		label: 'Add pet',
		icon: <CirclePlus size={20} />,
		to: '/add-pet',
	},
	{
		label: 'About',
		icon: <Info size={20} />,
		to: '/about',
	},
];

export default function BottomNav() {
	const location = useLocation();
	const activeIndex = getActiveIndex(location.pathname);

	return (
		<Nav aria-label="Primary navigation">
			<NavInner>
				<ActiveIndicator
					aria-hidden="true"
					style={{
						left: `calc(${activeIndex} * (100% / 3) + ((100% / 3) - 20%) / 2)`,
					}}
				/>
				{navItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={
							isActiveNavItem(location.pathname, item.to) ? 'active' : ''
						}
						aria-label={item.label}
					>
						<IconWrapper aria-hidden="true">{item.icon}</IconWrapper>
					</NavLink>
				))}
			</NavInner>
		</Nav>
	);
}

function isActiveNavItem(pathname: string, to: string) {
	if (to === '/') {
		return pathname === '/' || pathname.startsWith('/pets/');
	}

	return pathname === to;
}

function getActiveIndex(pathname: string) {
	return navItems.findIndex((item) => isActiveNavItem(pathname, item.to));
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
	padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
	backgroundColor: colors.pageBg,
});

const NavInner = styled.div({
	position: 'relative',
	display: 'grid',
	gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
	width: '100%',
	maxWidth: '420px',
});

const ActiveIndicator = styled.span({
	position: 'absolute',
	top: 0,
	bottom: 0,
	width: '20%',
	borderRadius: '20px',
	backgroundColor: colors.brandMint,
	pointerEvents: 'none',
	transition: 'left 220ms ease',
});

const NavLink = styled(RouterNavLink)({
	position: 'relative',
	zIndex: 1,
	display: 'grid',
	minHeight: '40px',
	placeItems: 'center',
	borderRadius: '20px',
	color: colors.warmGrey,
	fontSize: '0.75rem',
	textDecoration: 'none',
	WebkitTapHighlightColor: 'transparent',
	userSelect: 'none',
	'&.active': {
		color: colors.background,
	},
	'&:focus': {
		outline: 'none',
	},
	'&:active': {
		backgroundColor: 'transparent',
	},
});

const IconWrapper = styled.span({
	display: 'grid',
	placeItems: 'center',
});
