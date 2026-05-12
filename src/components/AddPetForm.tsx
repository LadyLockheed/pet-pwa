import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { petType, type Pet, type PetSpecies } from '../db';

const MAX_IMAGE_SIZE = 1024;
const IMAGE_QUALITY = 0.8;
const MAX_ORIGINAL_FILE_SIZE = 25 * 1024 * 1024;

interface AddPetFormProps {
	onAddPet: (pet: Pet) => Promise<void>;
}

export default function AddPetForm({ onAddPet }: AddPetFormProps) {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [breed, setBreed] = useState('');
	const [species, setSpecies] = useState<PetSpecies>(petType.dog);
	const [age, setAge] = useState('');
	const [pictureUrl, setPictureUrl] = useState<string>();
	const [pictureError, setPictureError] = useState('');
	const [isProcessingPicture, setIsProcessingPicture] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const now = new Date().toISOString();

		await onAddPet({
			id: crypto.randomUUID(),
			name: name.trim(),
			species,
			breed: breed.trim(),
			age: Number(age),
			pictureUrl,
			createdAt: now,
			updatedAt: now,
		});

		navigate('/');
	}

	async function handlePictureChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		setPictureError('');

		if (!file) {
			setPictureUrl(undefined);
			return;
		}

		if (file.size > MAX_ORIGINAL_FILE_SIZE) {
			setPictureUrl(undefined);
			setPictureError('Choose a smaller picture.');
			return;
		}

		setIsProcessingPicture(true);

		try {
			const resizedPicture = await resizeImage(file);

			setPictureUrl(resizedPicture);
		} catch {
			setPictureUrl(undefined);
			setPictureError('Could not use that picture. Try another one.');
		} finally {
			setIsProcessingPicture(false);
		}
	}

	function resizeImage(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			const imageUrl = URL.createObjectURL(file);

			image.onload = () => {
				URL.revokeObjectURL(imageUrl);

				const scale = Math.min(
					1,
					MAX_IMAGE_SIZE / Math.max(image.width, image.height),
				);
				const canvas = document.createElement('canvas');
				canvas.width = Math.round(image.width * scale);
				canvas.height = Math.round(image.height * scale);

				const context = canvas.getContext('2d');

				if (!context) {
					reject();
					return;
				}

				context.drawImage(image, 0, 0, canvas.width, canvas.height);
				resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
			};

			image.onerror = () => {
				URL.revokeObjectURL(imageUrl);
				reject();
			};

			image.src = imageUrl;
		});
	}

	return (
		<Form onSubmit={handleSubmit}>
			<Field>
				<span>Picture</span>
				<input type="file" accept="image/*" onChange={handlePictureChange} />
			</Field>

			{isProcessingPicture ? <PictureStatus>Preparing picture...</PictureStatus> : null}

			{pictureError ? <ErrorMessage>{pictureError}</ErrorMessage> : null}

			{pictureUrl ? (
				<PicturePreview src={pictureUrl} alt="Selected pet preview" />
			) : null}

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

			<SubmitButton type="submit" disabled={isProcessingPicture}>
				Add pet
			</SubmitButton>
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

const PictureStatus = styled.p({
	color: '#59636b',
	fontSize: '0.9rem',
	textAlign: 'center',
});

const ErrorMessage = styled.p({
	color: '#8a3d3d',
	fontSize: '0.9rem',
	fontWeight: 700,
	textAlign: 'center',
});

const PicturePreview = styled.img({
	width: '160px',
	aspectRatio: '1',
	justifySelf: 'center',
	borderRadius: '8px',
	objectFit: 'cover',
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
	'&:disabled': {
		cursor: 'not-allowed',
		opacity: 0.7,
	},
});
