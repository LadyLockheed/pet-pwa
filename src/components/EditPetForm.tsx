import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../types/pet';
import BackButton from './BackButton';
import PetForm from './PetForm';

interface EditPetFormProps {
	pets: Pet[];
	onUpdatePet: (pet: Pet) => Promise<void>;
}

export default function EditPetForm({ pets, onUpdatePet }: EditPetFormProps) {
	const { petId } = useParams();
	const navigate = useNavigate();
	const pet = pets.find((currentPet) => currentPet.id === petId);

	if (!pet) {
		return (
			<EmptyState>
				<h1>Pet not found</h1>
				<Link to="/">Back to pets</Link>
			</EmptyState>
		);
	}

	async function handleSubmit(updatedPet: Pet) {
		await onUpdatePet(updatedPet);
		navigate(`/pets/${updatedPet.id}`);
	}

	return (
		<FormView>
			<BackButton to={`/pets/${pet.id}`} label="Back to pet details" />
			<PetForm pet={pet} submitLabel="Save changes" onSubmit={handleSubmit} />
		</FormView>
	);
}

const EmptyState = styled.section({
	display: 'grid',
	justifyItems: 'center',
	gap: '16px',
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	padding: '24px',
});

const FormView = styled.section({
	display: 'grid',
	gap: '16px',
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	justifyItems: 'center',
	padding: '24px',
});
