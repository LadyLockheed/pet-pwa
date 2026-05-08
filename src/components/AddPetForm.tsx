import { useState } from 'react';
import styled from 'styled-components';
import { petType, type PetSpecies } from '../db';

export default function AddPetForm() {
	const [name, setName] = useState('');
	const [breed, setBreed] = useState('');
	const [species, setSpecies] = useState<PetSpecies>(petType.dog);
	const [age, setAge] = useState('');

	return (
		<Form>
			<Field>
				<span>Name</span>
				<input
					type="text"
					value={name}
					onChange={(event) => setName(event.target.value)}
				/>
			</Field>

			<Field>
				<span>Breed</span>
				<input
					type="text"
					value={breed}
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
					onChange={(event) => setAge(event.target.value)}
				/>
			</Field>
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
