import styled from 'styled-components';
import BottomNav from './BottomNav';

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<Wrapper>
			<Main>{children}</Main>
			<BottomNav />
		</Wrapper>
	);
}

const Wrapper = styled.div({
	width: '100%',
	boxSizing: 'border-box',
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
});

const Main = styled.main({
	width: '100%',
	boxSizing: 'border-box',
	display: 'flex',
	flex: 1,
	flexDirection: 'column',
	alignItems: 'center',
	paddingBottom: '88px',
	// marginTop: '20px',
});
