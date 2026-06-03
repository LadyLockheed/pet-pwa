import styled from 'styled-components';
import BottomNav from './BottomNav';
import { colors } from '../styles/colors';

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<Wrapper>
			<BackgroundLayer aria-hidden="true">
				<Wave viewBox="0 0 1440 320" preserveAspectRatio="none">
					<path
						fill={colors.pageBg}
						fillOpacity="1"
						d="M0,192L60,202.7C120,213,240,235,360,229.3C480,224,600,192,720,154.7C840,117,960,75,1080,64C1200,53,1320,75,1380,85.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
					/>
				</Wave>
			</BackgroundLayer>
			<Main>{children}</Main>
			<BottomNav />
		</Wrapper>
	);
}

const Wrapper = styled.div({
	position: 'relative',
	overflow: 'hidden',
	width: '100%',
	boxSizing: 'border-box',
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	backgroundColor: colors.pageBg,
	padding: '20px',
});

const BackgroundLayer = styled.div({
	position: 'absolute',
	top: 0,
	left: 0,
	right: 0,
	height: '200px',
	backgroundColor: colors.warmWhite,
	overflow: 'hidden',
	zIndex: 0,
});

const Wave = styled.svg({
	position: 'absolute',
	right: 0,
	bottom: '-1px',
	left: 0,
	width: '100%',
	height: '150px',
});

const Main = styled.main({
	position: 'relative',
	zIndex: 1,
	width: '100%',
	boxSizing: 'border-box',
	display: 'flex',
	flex: 1,
	flexDirection: 'column',
	alignItems: 'center',
	paddingBottom: '88px',
});
