import styled from 'styled-components';
import { colors } from '../styles/colors';
import { spacings } from '../styles/spacings';

interface BirthdayBannerProps {
	petName: string;
}

export default function BirthDayBanner({ petName }: BirthdayBannerProps) {
	return (
		<BannerContainer>
			<span>🎉Grattis på födelsedagen {petName}!! 🎂</span>
		</BannerContainer>
	);
}

const BannerContainer = styled.div({
	height: '20px',
	// width: '100%',
	backgroundImage: `linear-gradient(to right, ${colors.darkGreen}, ${colors.darkMint})`,
	padding: spacings.x2,
	display: 'flex',
	alignItems: 'center',
	borderRadius: '8px',
	justifyContent: 'center',

	'& span': {
		fontSize: '12px',
		color: colors.blackBrown,
		margin: 0,
	},
});
