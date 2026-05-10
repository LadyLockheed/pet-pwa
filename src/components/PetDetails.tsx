import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../db';

interface PetDetailsProps {
	pets: Pet[];
}

export default function PetDetails({ pets }: PetDetailsProps) {
	const { petId } = useParams();
	const pet = pets.find((currentPet) => currentPet.id === petId);

	if (!pet) {
		return (
			<Details>
				<BackButton to="/" aria-label="Back to pets overview">
					←
				</BackButton>
				<h1>Pet not found</h1>
				<Link to="/">Back to pets</Link>
			</Details>
		);
	}

	const petDetails = [
		['Breed', pet.breed],
		['Age', pet.age],
	];

	return (
		<Details>
			<BackButton to="/" aria-label="Back to pets overview">
				←
			</BackButton>
			<h1>{pet.name}</h1>
			<PicturePlaceholder />
			<InfoList>
				{petDetails.map(([label, value]) => (
					<li key={label}>
						<strong>{label}:</strong> {value}
					</li>
				))}
			</InfoList>
		</Details>
	);
}

const Details = styled.section({
	display: 'grid',
	justifyItems: 'center',
	gap: '16px',
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	padding: '24px',
});

const BackButton = styled(Link)({
	justifySelf: 'start',
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

const PicturePlaceholder = styled.div({
	width: '220px',
	aspectRatio: '1',
	border: '2px dashed #b9a1df',
	borderRadius: '8px',
	backgroundColor: '#f7f2ff',
});

const InfoList = styled.ul({
	width: '100%',
	maxWidth: '420px',
	margin: 0,
	paddingLeft: '20px',
	lineHeight: 1.8,
});
