import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import styled from 'styled-components';
import {
	petType,
	type Pet,
	type PetBreederInfo,
	type PetHealth,
	type PetMeasurements,
	type PetSex,
	type PetSpecies,
} from '../types/pet';
import { spacings } from '../styles/spacings';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const MAX_IMAGE_SIZE = 1024;
const IMAGE_QUALITY = 0.8;
const MAX_ORIGINAL_FILE_SIZE = 25 * 1024 * 1024;

interface PetFormProps {
	pet?: Pet;
	submitLabel: string;
	onSubmit: (pet: Pet) => Promise<void>;
}

export default function PetForm({ pet, submitLabel, onSubmit }: PetFormProps) {
	const [name, setName] = useState(pet?.name ?? '');
	const [breed, setBreed] = useState(pet?.breed ?? '');
	const [species, setSpecies] = useState<PetSpecies>(
		pet?.species ?? petType.dog,
	);
	const [sex, setSex] = useState<PetSex>(pet?.sex ?? 'female');
	const [dateOfBirth, setDateOfBirth] = useState(pet?.dateOfBirth ?? '');
	const [pictureUrl, setPictureUrl] = useState<string | undefined>(
		pet?.pictureUrl,
	);
	const [backLength, setBackLength] = useState(
		pet?.measurements?.backLength?.toString() ?? '',
	);
	const [neckCircumference, setNeckCircumference] = useState(
		pet?.measurements?.neckCircumference?.toString() ?? '',
	);
	const [latestVaccinationDate, setLatestVaccinationDate] = useState(
		pet?.health?.latestVaccinationDate ?? '',
	);
	const [heatStartDate, setHeatStartDate] = useState(
		pet?.health?.heatCycle?.startDate ?? '',
	);
	const [heatEndDate, setHeatEndDate] = useState(
		pet?.health?.heatCycle?.endDate ?? '',
	);
	const [standingHeatDate, setStandingHeatDate] = useState(
		pet?.health?.heatCycle?.standingHeatDate ?? '',
	);
	const [breederName, setBreederName] = useState(
		pet?.breederInfo?.breederName ?? '',
	);
	const [skkHunddataUrl, setSkkHunddataUrl] = useState(
		pet?.breederInfo?.skkHunddataUrl ?? '',
	);
	const [pictureError, setPictureError] = useState('');
	const [isProcessingPicture, setIsProcessingPicture] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const now = new Date().toISOString();
		const measurements = getMeasurements();
		const health = getHealth();
		const breederInfo = getBreederInfo();

		await onSubmit({
			id: pet?.id ?? crypto.randomUUID(),
			name: name.trim(),
			sex,
			species,
			breed: breed.trim(),
			dateOfBirth,
			pictureUrl,
			...(measurements ? { measurements } : {}),
			...(health ? { health } : {}),
			...(breederInfo ? { breederInfo } : {}),
			createdAt: pet?.createdAt ?? now,
			updatedAt: now,
		});
	}

	function getMeasurements(): PetMeasurements | undefined {
		const measurements: PetMeasurements = {};

		if (backLength) {
			measurements.backLength = Number(backLength);
		}

		if (neckCircumference) {
			measurements.neckCircumference = Number(neckCircumference);
		}

		return Object.keys(measurements).length > 0 ? measurements : undefined;
	}

	function getHealth(): PetHealth | undefined {
		const health: PetHealth = {};

		if (latestVaccinationDate) {
			health.latestVaccinationDate = latestVaccinationDate;
		}

		if (heatStartDate || heatEndDate || standingHeatDate) {
			health.heatCycle = {
				...(heatStartDate ? { startDate: heatStartDate } : {}),
				...(heatEndDate ? { endDate: heatEndDate } : {}),
				...(standingHeatDate ? { standingHeatDate } : {}),
			};
		}

		return Object.keys(health).length > 0 ? health : undefined;
	}

	function getBreederInfo(): PetBreederInfo | undefined {
		const breederInfo: PetBreederInfo = {};

		if (breederName.trim()) {
			breederInfo.breederName = breederName.trim();
		}

		if (skkHunddataUrl.trim()) {
			breederInfo.skkHunddataUrl = skkHunddataUrl.trim();
		}

		return Object.keys(breederInfo).length > 0 ? breederInfo : undefined;
	}

	async function handlePictureChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		setPictureError('');

		if (!file) {
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
			<FormHeader>
				<FormTitle>{pet ? 'Edit pet profile' : 'Add a pet profile'}</FormTitle>
				<FormIntro>
					Fill in the same details shown on the pet profile.
				</FormIntro>
			</FormHeader>

			<ImageField>
				<span>Pet image</span>
				<ImageUploadTile>
					{pictureUrl ? (
						<PicturePreview src={pictureUrl} alt="Selected pet preview" />
					) : (
						<>
							<ImagePlus size={22} />
							<span>Upload image</span>
						</>
					)}
					<input type="file" accept="image/*" onChange={handlePictureChange} />
				</ImageUploadTile>
			</ImageField>

			{isProcessingPicture ? (
				<PictureStatus>Preparing picture...</PictureStatus>
			) : null}

			{pictureError ? <ErrorMessage>{pictureError}</ErrorMessage> : null}

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
				<legend>Sex</legend>
				<RadioOption>
					<input
						type="radio"
						name="sex"
						value="female"
						checked={sex === 'female'}
						onChange={() => setSex('female')}
					/>
					Female
				</RadioOption>
				<RadioOption>
					<input
						type="radio"
						name="sex"
						value="male"
						checked={sex === 'male'}
						onChange={() => setSex('male')}
					/>
					Male
				</RadioOption>
			</Fieldset>

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
				<span>Date of birth</span>
				<input
					type="date"
					max={new Date().toISOString().split('T')[0]}
					value={dateOfBirth}
					required
					onChange={(event) => setDateOfBirth(event.target.value)}
				/>
			</Field>

			<Section open={Boolean(pet?.measurements)}>
				<summary>Measurements</summary>
				<SectionContent>
					<Field>
						<span>Back length</span>
						<input
							type="number"
							min="0"
							inputMode="decimal"
							value={backLength}
							onChange={(event) => setBackLength(event.target.value)}
						/>
					</Field>
					<Field>
						<span>Neck circumference</span>
						<input
							type="number"
							min="0"
							inputMode="decimal"
							value={neckCircumference}
							onChange={(event) => setNeckCircumference(event.target.value)}
						/>
					</Field>
				</SectionContent>
			</Section>

			<Section open={Boolean(pet?.health)}>
				<summary>Health</summary>
				<SectionContent>
					<Field>
						<span>Latest vaccination date</span>
						<input
							type="date"
							max={new Date().toISOString().split('T')[0]}
							value={latestVaccinationDate}
							onChange={(event) => setLatestVaccinationDate(event.target.value)}
						/>
					</Field>
					<Field>
						<span>Heat cycle start</span>
						<input
							type="date"
							value={heatStartDate}
							onChange={(event) => setHeatStartDate(event.target.value)}
						/>
					</Field>
					<Field>
						<span>Heat cycle end</span>
						<input
							type="date"
							value={heatEndDate}
							onChange={(event) => setHeatEndDate(event.target.value)}
						/>
					</Field>
					<Field>
						<span>Standing heat date</span>
						<input
							type="date"
							value={standingHeatDate}
							onChange={(event) => setStandingHeatDate(event.target.value)}
						/>
					</Field>
				</SectionContent>
			</Section>

			<Section open={Boolean(pet?.breederInfo)}>
				<summary>Breeder information</summary>
				<SectionContent>
					<Field>
						<span>Breeder name</span>
						<input
							type="text"
							value={breederName}
							onChange={(event) => setBreederName(event.target.value)}
						/>
					</Field>
					<Field>
						<span>SKK Hunddata link</span>
						<input
							type="url"
							value={skkHunddataUrl}
							onChange={(event) => setSkkHunddataUrl(event.target.value)}
						/>
					</Field>
				</SectionContent>
			</Section>

			<SubmitButton type="submit" disabled={isProcessingPicture}>
				{submitLabel}
			</SubmitButton>
		</Form>
	);
}

const Form = styled.form({
	display: 'grid',
	gap: spacings.x4,
	width: '100%',
	maxWidth: '420px',
	boxSizing: 'border-box',
	borderRadius: '4px',
	backgroundColor: colors.white,
	padding: spacings.x4,
});

const FormHeader = styled.header({
	display: 'grid',
	gap: spacings.x2,
});

const FormTitle = styled.h1({
	...typography.screenTitle,
	margin: 0,
});

const FormIntro = styled.p({
	...typography.body,
	margin: 0,
});

const Field = styled.label({
	display: 'grid',
	gap: '6px',
	...typography.body,
	'& span': {
		fontWeight: 500,
	},
	'& input': {
		boxSizing: 'border-box',
		width: '100%',
		minHeight: '36px',
		border: `1px solid ${colors.darkBeige}`,
		borderRadius: '4px',
		backgroundColor: '#ffffff',
		boxShadow: '0 2px 5px rgba(47, 25, 15, 0.12)',
		color: colors.blackBrown,
		font: 'inherit',
		padding: `${spacings.x2} ${spacings.x3}`,
	},
	'& input[type="file"]': {
		boxShadow: 'none',
		padding: spacings.x2,
	},
});

const ImageField = styled.label({
	display: 'grid',
	justifyItems: 'start',
	gap: '6px',
	...typography.body,
	'& > span': {
		fontWeight: 500,
	},
});

const ImageUploadTile = styled.span({
	display: 'grid',
	width: '128px',
	aspectRatio: '1',
	overflow: 'hidden',
	placeItems: 'center',
	alignContent: 'center',
	gap: spacings.x1,
	border: `1px dashed ${colors.darkBeige}`,
	borderRadius: '4px',
	backgroundColor: '#fbf8f4',
	color: colors.warmBrown,
	cursor: 'pointer',
	'& input': {
		position: 'absolute',
		width: '1px',
		height: '1px',
		overflow: 'hidden',
		clip: 'rect(0 0 0 0)',
		clipPath: 'inset(50%)',
		whiteSpace: 'nowrap',
	},
});

const Fieldset = styled.fieldset({
	display: 'flex',
	gap: spacings.x4,
	margin: 0,
	padding: 0,
	border: 0,
	'& legend': {
		...typography.body,
		marginBottom: '6px',
		fontWeight: 500,
	},
});

const RadioOption = styled.label({
	display: 'flex',
	alignItems: 'center',
	gap: '6px',
	...typography.body,
});

const Section = styled.details({
	position: 'relative',
	borderTop: `1px solid ${colors.darkBeige}`,
	paddingTop: spacings.x3,
	'& summary': {
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		...typography.sectionLabel,
		listStyle: 'none',
	},
	'& summary::-webkit-details-marker': {
		display: 'none',
	},
	'& summary::after': {
		content: '""',
		flex: 1,
		height: '1px',
		marginLeft: spacings.x2,
		backgroundColor: colors.darkBeige,
	},
	'&[open]': {
		border: `1px solid ${colors.darkBeige}`,
		borderRadius: '4px',
		backgroundColor: '#fbf8f4',
		padding: spacings.x3,
	},
	'&[open] summary::after': {
		display: 'none',
	},
});

const SectionContent = styled.div({
	display: 'grid',
	gap: spacings.x4,
	paddingTop: spacings.x4,
});

const PictureStatus = styled.p({
	...typography.meta,
	margin: 0,
	textAlign: 'center',
});

const ErrorMessage = styled.p({
	margin: 0,
	color: '#8a3d3d',
	fontSize: typography.meta.fontSize,
	fontWeight: 700,
	textAlign: 'center',
});

const PicturePreview = styled.img({
	width: '100%',
	height: '100%',
	aspectRatio: '1',
	borderRadius: '4px',
	objectFit: 'cover',
});

const SubmitButton = styled.button({
	border: 0,
	borderRadius: '4px',
	backgroundColor: colors.warmBrown,
	color: colors.warmWhite,
	cursor: 'pointer',
	font: 'inherit',
	fontWeight: 800,
	padding: '12px 16px',
	'&:disabled': {
		cursor: 'not-allowed',
		opacity: 0.7,
	},
});
