import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../types/pet';
import PetForm from './PetForm';
import { spacings } from '../styles/spacings';
import PageHeader from './PageHeader';

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
			<PageHeader to="/" label="Back to pets overview" title="Add your pet" />

			<PetForm submitLabel="Add pet" onSubmit={handleSubmit} />
		</FormView>
	);
}

const FormView = styled.section({
	display: 'grid',
	gap: spacings.x2,
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	justifyItems: 'center',
});
