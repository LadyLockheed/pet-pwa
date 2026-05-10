import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { petType, type Pet, type PetSpecies } from '../db';

interface AddPetFormProps {
	onAddPet: (pet: Pet) => Promise<void>;
}

export default function AddPetForm({ onAddPet }: AddPetFormProps) {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [breed, setBreed] = useState('');
	const [species, setSpecies] = useState<PetSpecies>(petType.dog);
	const [age, setAge] = useState('');

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const now = new Date().toISOString();

		await onAddPet({
			id: crypto.randomUUID(),
			name: name.trim(),
			species,
			breed: breed.trim(),
			age: Number(age),
			createdAt: now,
			updatedAt: now,
		});

		navigate('/');
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Field>
				<span>Name</span>
				<input
					type="text"
					value={name}
					required
					onChange={(event) => setName(event.target.value)}
				/>
			</Field>

			<Field>
				<span>Breed</span>
				<input
					type="text"
					value={breed}
					required
					onChange={(event) => setBreed(event.target.value)}
				/>
			</Field>

			<Fieldset>
				<legend>Species</legend>
				<RadioOption>
					<input
						type="radio"
						name="species"
						value={petType.dog}
						checked={species === petType.dog}
						onChange={() => setSpecies(petType.dog)}
					/>
					Dog
				</RadioOption>
				<RadioOption>
					<input
						type="radio"
						name="species"
						value={petType.cat}
						checked={species === petType.cat}
						onChange={() => setSpecies(petType.cat)}
					/>
					Cat
				</RadioOption>
			</Fieldset>

			<Field>
				<span>Age</span>
				<input
					type="number"
					min="0"
					value={age}
					required
					onChange={(event) => setAge(event.target.value)}
				/>
			</Field>

			<SubmitButton type="submit">Add pet</SubmitButton>
		</Form>
	);
}

const Form = styled.form({
	display: 'grid',
	gap: '16px',
	width: '100%',
	maxWidth: '420px',
});

const Field = styled.label({
	display: 'grid',
	gap: '6px',
	fontWeight: 700,
});

const Fieldset = styled.fieldset({
	display: 'flex',
	gap: '16px',
	margin: 0,
	padding: 0,
	border: 0,
});

const RadioOption = styled.label({
	display: 'flex',
	alignItems: 'center',
	gap: '6px',
	fontWeight: 700,
});

const SubmitButton = styled.button({
	border: 0,
	borderRadius: '8px',
	backgroundColor: '#2f6f73',
	color: '#ffffff',
	cursor: 'pointer',
	font: 'inherit',
	fontWeight: 800,
	padding: '12px 16px',
});
