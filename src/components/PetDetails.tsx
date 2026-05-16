import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../types/pet';

interface PetDetailsProps {
	pets: Pet[];
	onDeletePet: (petId: string) => Promise<void>;
}

export default function PetDetails({ pets, onDeletePet }: PetDetailsProps) {
	const { petId } = useParams();
	const navigate = useNavigate();
	const pet = pets.find((currentPet) => currentPet.id === petId);

	if (!pet) {
		return (
			<Details>
				<TopActions>
					<BackButton to="/" aria-label="Back to pets overview">
						&larr;
					</BackButton>
				</TopActions>
				<h1>Pet not found</h1>
				<Link to="/">Back to pets</Link>
			</Details>
		);
	}

	const selectedPet = pet;

	async function handleDelete() {
		const shouldDelete = window.confirm(`Delete ${selectedPet.name}?`);

		if (!shouldDelete) {
			return;
		}

		await onDeletePet(selectedPet.id);
		navigate('/');
	}

	const petDetails = [
		['Breed', pet.breed],
		['Age', pet.age],
	];

	return (
		<Details>
			<TopActions>
				<BackButton to="/" aria-label="Back to pets overview">
					&larr;
				</BackButton>
				<DeleteButton type="button" onClick={handleDelete}>
					Delete
				</DeleteButton>
			</TopActions>
			<h1>{pet.name}</h1>
			{pet.pictureUrl ? (
				<PetPicture src={pet.pictureUrl} alt={pet.name} />
			) : (
				<PicturePlaceholder />
			)}
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

const TopActions = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
});

const BackButton = styled(Link)({
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

const DeleteButton = styled.button({
	border: 0,
	borderRadius: '8px',
	backgroundColor: '#8a3d3d',
	color: '#ffffff',
	cursor: 'pointer',
	font: 'inherit',
	fontWeight: 800,
	padding: '10px 14px',
});

const PicturePlaceholder = styled.div({
	width: '220px',
	aspectRatio: '1',
	border: '2px dashed #b9a1df',
	borderRadius: '8px',
	backgroundColor: '#f7f2ff',
});

const PetPicture = styled.img({
	width: '220px',
	aspectRatio: '1',
	borderRadius: '8px',
	objectFit: 'cover',
});

const InfoList = styled.ul({
	width: '100%',
	maxWidth: '420px',
	margin: 0,
	paddingLeft: '20px',
	lineHeight: 1.8,
});
