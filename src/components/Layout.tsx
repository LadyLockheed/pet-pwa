import styled from 'styled-components';

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return <Wrapper>{children}</Wrapper>;
}

const Wrapper = styled.div({
	width: '100%',
	boxSizing: 'border-box',
	minHeight: '100vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
});
