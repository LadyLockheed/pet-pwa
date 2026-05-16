import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Pet } from '../types/pet';
import { formatAgeFromDateOfBirth } from '../utils/petAge';

interface PetCardProps {
	pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
	return (
		<CardLink to={`/pets/${pet.id}`}>
			{pet.pictureUrl ? (
				<PetPicture src={pet.pictureUrl} alt={pet.name} />
			) : (
				<PicturePlaceholder />
			)}
			<PetInfo>
				<Name>{pet.name}</Name>
				<MetaRow>
					<span>{pet.breed}</span>
					<span>{pet.sex ?? 'Unknown sex'}</span>
				</MetaRow>
				<Age>{formatAgeFromDateOfBirth(pet.dateOfBirth)}</Age>
			</PetInfo>
		</CardLink>
	);
}

const Name = styled.h1({
	margin: 0,
	fontSize: '1.5rem',
	lineHeight: 1.1,
});

const CardLink = styled(Link)({
	display: 'grid',
	gridTemplateColumns: '112px 1fr',
	alignItems: 'center',
	gap: '16px',
	padding: '16px',
	border: '1px solid #d7c7f2',
	borderRadius: '8px',
	backgroundColor: '#ffffff',
	color: 'inherit',
	textDecoration: 'none',
});

const PicturePlaceholder = styled.div({
	width: '112px',
	aspectRatio: '1',
	flexShrink: 0,
	border: '2px dashed #b9a1df',
	borderRadius: '8px',
	backgroundColor: '#f7f2ff',
});

const PetPicture = styled.img({
	width: '112px',
	aspectRatio: '1',
	borderRadius: '8px',
	objectFit: 'cover',
});

const PetInfo = styled.div({
	display: 'grid',
	gap: '8px',
});

const MetaRow = styled.div({
	display: 'flex',
	flexWrap: 'wrap',
	gap: '8px',
	color: '#59636b',
	textTransform: 'capitalize',
});

const Age = styled.p({
	margin: 0,
	color: '#263133',
	fontWeight: 700,
});
