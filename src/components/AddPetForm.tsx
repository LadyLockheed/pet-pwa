import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../types/pet';
import BackButton from './BackButton';
import PetForm from './PetForm';

interface AddPetFormProps {
	onAddPet: (pet: Pet) => Promise<void>;
}

export default function AddPetForm({ onAddPet }: AddPetFormProps) {
	const navigate = useNavigate();

	async function handleSubmit(pet: Pet) {
		await onAddPet(pet);
		navigate('/');
	}

	return (
		<FormView>
			<BackButton to="/" label="Back to pets overview" />
			<PetForm submitLabel="Add pet" onSubmit={handleSubmit} />
		</FormView>
	);
}

const FormView = styled.section({
	display: 'grid',
	gap: '16px',
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	justifyItems: 'center',
	padding: '24px',
});
