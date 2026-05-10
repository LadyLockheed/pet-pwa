import styled from 'styled-components';
import type { Pet } from '../db';
import PetCard from './PetCard';

interface PetsOverviewProps {
	pets: Pet[];
}

export default function PetsOverview({ pets }: PetsOverviewProps) {
	if (pets.length === 0) {
		return <div>Du har inte lagt in några djur än</div>;
	}
	return (
		<Overview>
			{pets.map((pet) => (
				<PetCard key={pet.id} pet={pet} />
			))}
		</Overview>
	);
}

const Overview = styled.section({
	display: 'grid',
	gap: '16px',
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	padding: '24px',
});
