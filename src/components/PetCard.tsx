import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Pet } from '../types/pet';

interface PetCardProps {
	pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
	const petDetails = [
		['Breed', pet.breed],
		['Age', pet.age],
	];

	return (
		<CardLink to={`/pets/${pet.id}`}>
			<PetMedia>
				<Name>{pet.name}</Name>
				{pet.pictureUrl ? (
					<PetPicture src={pet.pictureUrl} alt={pet.name} />
				) : (
					<PicturePlaceholder />
				)}
			</PetMedia>
			<DetailsList>
				{petDetails.map(([label, value]) => (
					<li key={label}>
						<strong>{label}:</strong> {value}
					</li>
				))}
			</DetailsList>
		</CardLink>
	);
}

const Name = styled.h1({
	margin: '0 0 16px',
	fontSize: '2rem',
	textAlign: 'center',
});

const CardLink = styled(Link)({
	display: 'block',
	padding: '24px',
	border: '1px solid #d7c7f2',
	borderRadius: '8px',
	backgroundColor: '#ffffff',
	color: 'inherit',
	textDecoration: 'none',
});

const PetMedia = styled.div({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
});

const PicturePlaceholder = styled.div({
	width: '180px',
	aspectRatio: '1',
	flexShrink: 0,
	border: '2px dashed #b9a1df',
	borderRadius: '8px',
	backgroundColor: '#f7f2ff',
});

const PetPicture = styled.img({
	width: '180px',
	aspectRatio: '1',
	borderRadius: '8px',
	objectFit: 'cover',
});

const DetailsList = styled.ul({
	margin: 0,
	paddingLeft: '20px',
	lineHeight: 1.8,
});
