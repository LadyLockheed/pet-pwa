import styled from 'styled-components';
import PetCard from './PetCard';
import type { Pet } from '../types/pet';
import { spacings } from '../styles/spacings';
import { colors } from '../styles/colors';
import { Link } from 'react-router-dom';
import { CirclePlus } from 'lucide-react';

interface PetsOverviewProps {
	pets: Pet[];
}

export default function PetsOverview({ pets }: PetsOverviewProps) {
	return (
		<Overview>
			<Headline>
				Tassar<span style={{ color: colors.orange }}>&</span>Nosar
			</Headline>

			{pets.length === 0 ? (
				<EmptyStateContent>
					<EmptyStateText>
						Här var det tomt. Klicka på + för att lägga till en pälskling
					</EmptyStateText>
					<AddPetLink to="/add-pet">
						<CirclePlus size={32} />
					</AddPetLink>
				</EmptyStateContent>
			) : (
				pets.map((pet) => <PetCard key={pet.id} pet={pet} />)
			)}
		</Overview>
	);
}

const Overview = styled.section({
	display: 'grid',
	gap: spacings.x4,
	width: '100%',
	boxSizing: 'border-box',
	padding: spacings.x3,
	minHeight: 'calc(100vh - 120px)',
});

const EmptyStateContent = styled.div({
	display: 'grid',
	justifyItems: 'center',
	alignContent: 'center',
	gap: spacings.x4,
	textAlign: 'center',
});

const EmptyStateText = styled.div({
	color: colors.warmWhite,
});

const AddPetLink = styled(Link)({
	color: colors.orange,
});

const Headline = styled.h1({
	fontFamily: "'EB Garamond', Georgia, serif",
	fontWeight: 700,
	color: colors.background,
	margin: 'auto',
	marginBottom: spacings.x6,
});
