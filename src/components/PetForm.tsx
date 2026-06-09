import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import styled from 'styled-components';
import {
	petType,
	type Pet,
	type PetBreederInfo,
	type HeatCycle,
	type PetHealth,
	type PetMeasurements,
	type PetSex,
	type PetSpecies,
} from '../types/pet';
import { spacings } from '../styles/spacings';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';
import CollapsibleSection from './CollapsibleSection';

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_IMAGE_SIZE = 1024;
const IMAGE_QUALITY = 0.8;
const MAX_ORIGINAL_FILE_SIZE = 25 * 1024 * 1024;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PetFormProps {
	pet?: Pet;
	submitLabel: string;
	onSubmit: (pet: Pet) => Promise<void>;
}

interface FormState {
	// Basic information
	name: string;
	breed: string;
	species: PetSpecies;
	sex: PetSex;
	dateOfBirth: string;
	dateOfArrival: string;
	pictureUrl: string | undefined;
	// Measurements
	height: string;
	backLength: string;
	neckCircumference: string;
	chestCircumference: string;
	// Health
	weight: string;
	latestVaccinationDate: string;
	// Breeder information
	breederName: string;
	registeredName: string;
	skkHunddataUrl: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PetForm({ pet, submitLabel, onSubmit }: PetFormProps) {
	// State
	const [form, setForm] = useState<FormState>(getInitialFormState(pet));
	const [heatCycles, setHeatCycles] = useState<HeatCycle[]>(getInitialHeatCycles(pet));
	const [pictureError, setPictureError] = useState('');
	const [isProcessingPicture, setIsProcessingPicture] = useState(false);

	const today = new Date().toISOString().split('T')[0];

	// Helpers
	function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	// Submit handler
	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const now = new Date().toISOString();
		const measurements = getMeasurements();
		const health = getHealth();
		const savedHeatCycles = getHeatCycles();
		const breederInfo = getBreederInfo();

		await onSubmit({
			id: pet?.id ?? crypto.randomUUID(),
			name: form.name.trim(),
			sex: form.sex,
			species: form.species,
			breed: form.breed.trim(),
			dateOfBirth: form.dateOfBirth,
			...(form.dateOfArrival ? { dateOfArrival: form.dateOfArrival } : {}),
			pictureUrl: form.pictureUrl,
			...(measurements ? { measurements } : {}),
			...(health ? { health } : {}),
			...(savedHeatCycles ? { heatCycles: savedHeatCycles } : {}),
			...(breederInfo ? { breederInfo } : {}),
			createdAt: pet?.createdAt ?? now,
			updatedAt: now,
		});
	}

	// Form data builders
	function getMeasurements(): PetMeasurements | undefined {
		const measurements: PetMeasurements = {};
		if (form.height) measurements.height = Number(form.height);
		if (form.backLength) measurements.backLength = Number(form.backLength);
		if (form.neckCircumference) measurements.neckCircumference = Number(form.neckCircumference);
		if (form.chestCircumference) measurements.chestCircumference = Number(form.chestCircumference);
		return pickDefined(measurements);
	}

	function getHealth(): PetHealth | undefined {
		const health: PetHealth = {};
		if (form.latestVaccinationDate) health.latestVaccinationDate = form.latestVaccinationDate;
		if (form.weight) health.weight = Number(form.weight);
		return pickDefined(health);
	}

	function getHeatCycles(): HeatCycle[] | undefined {
		if (form.sex !== 'female') return undefined;

		const saved = heatCycles
			.filter((heatCycle) => heatCycle.startDate)
			.map((heatCycle) => ({
				startDate: heatCycle.startDate,
				...(heatCycle.endDate ? { endDate: heatCycle.endDate } : {}),
				...(heatCycle.standingHeatStartDate
					? { standingHeatStartDate: heatCycle.standingHeatStartDate }
					: {}),
				...(heatCycle.standingHeatEndDate
					? { standingHeatEndDate: heatCycle.standingHeatEndDate }
					: {}),
			}));

		return saved.length > 0 ? saved : undefined;
	}

	function getBreederInfo(): PetBreederInfo | undefined {
		const breederInfo: PetBreederInfo = {};
		const name = form.breederName.trim();
		const registeredName = form.registeredName.trim();
		const url = form.skkHunddataUrl.trim();
		if (name) breederInfo.breederName = name;
		if (registeredName) breederInfo.registeredName = registeredName;
		if (url) breederInfo.skkHunddataUrl = url;
		return pickDefined(breederInfo);
	}

	// Heat cycle handlers
	function updateHeatCycle(index: number, field: keyof HeatCycle, value: string) {
		setHeatCycles((current) =>
			current.map((heatCycle, i) =>
				i === index ? { ...heatCycle, [field]: value } : heatCycle,
			),
		);
	}

	function addHeatCycle() {
		setHeatCycles((current) => [...current, {}]);
	}

	function removeHeatCycle(index: number) {
		setHeatCycles((current) => {
			const next = current.filter((_, i) => i !== index);
			return next.length > 0 ? next : [{}];
		});
	}

	// Picture handlers
	async function handlePictureChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		setPictureError('');

		if (!file) return;

		if (file.size > MAX_ORIGINAL_FILE_SIZE) {
			setField('pictureUrl', undefined);
			setPictureError('Choose a smaller picture.');
			return;
		}

		setIsProcessingPicture(true);

		try {
			const resizedPicture = await resizeImage(file);
			setField('pictureUrl', resizedPicture);
		} catch {
			setField('pictureUrl', undefined);
			setPictureError('Could not use that picture. Try another one.');
		} finally {
			setIsProcessingPicture(false);
		}
	}

	// ─── JSX ─────────────────────────────────────────────────────────────────

	return (
		<Form onSubmit={handleSubmit}>

			{/* Picture */}
			<ImageField>
				<span>Pet image</span>
				<ImageUploadTile>
					{form.pictureUrl ? (
						<PicturePreview src={form.pictureUrl} alt="Selected pet preview" />
					) : (
						<>
							<ImagePlus size={22} />
							<span>Upload image</span>
						</>
					)}
					<input type="file" accept="image/*" onChange={handlePictureChange} />
				</ImageUploadTile>
			</ImageField>

			{isProcessingPicture ? <PictureStatus>Preparing picture...</PictureStatus> : null}
			{pictureError ? <ErrorMessage>{pictureError}</ErrorMessage> : null}

			{/* Basic information */}
			<Field>
				<span>Name</span>
				<input
					type="text"
					value={form.name}
					required
					onChange={(event) => setField('name', event.target.value)}
				/>
			</Field>

			<Field>
				<span>Breed</span>
				<input
					type="text"
					value={form.breed}
					required
					onChange={(event) => setField('breed', event.target.value)}
				/>
			</Field>

			<Fieldset>
				<legend>Sex</legend>
				<RadioOption>
					<input
						type="radio"
						name="sex"
						value="female"
						required
						checked={form.sex === 'female'}
						onChange={() => setField('sex', 'female')}
					/>
					Female
				</RadioOption>
				<RadioOption>
					<input
						type="radio"
						name="sex"
						value="male"
						checked={form.sex === 'male'}
						onChange={() => setField('sex', 'male')}
					/>
					Male
				</RadioOption>
			</Fieldset>

			<SectionContent>
				<Fieldset>
					<legend>Species</legend>
					<RadioOption>
						<input
							type="radio"
							name="species"
							value={petType.dog}
							checked={form.species === petType.dog}
							onChange={() => setField('species', petType.dog)}
						/>
						Dog
					</RadioOption>
					<RadioOption>
						<input
							type="radio"
							name="species"
							value={petType.cat}
							checked={form.species === petType.cat}
							onChange={() => setField('species', petType.cat)}
						/>
						Cat
					</RadioOption>
				</Fieldset>
			</SectionContent>

			<Field>
				<span>Date of birth</span>
				<input
					type="date"
					max={today}
					value={form.dateOfBirth}
					required
					onChange={(event) => setField('dateOfBirth', event.target.value)}
				/>
			</Field>

			<Field>
				<span>Moved in together</span>
				<input
					type="date"
					max={today}
					value={form.dateOfArrival}
					onChange={(event) => setField('dateOfArrival', event.target.value)}
				/>
			</Field>

			{/* Measurements */}
			<CollapsibleSection
				title="Measurements"
				defaultOpen={Boolean(pet?.measurements)}
			>
				<FieldGroup>
					<Field>
						<span>Height</span>
						<input
							type="number"
							min="0"
							inputMode="decimal"
							value={form.height}
							onChange={(event) => setField('height', event.target.value)}
						/>
					</Field>
					<Field>
						<span>Back length</span>
						<input
							type="number"
							min="0"
							inputMode="decimal"
							value={form.backLength}
							onChange={(event) => setField('backLength', event.target.value)}
						/>
					</Field>
					<Field>
						<span>Neck circumference</span>
						<input
							type="number"
							min="0"
							inputMode="decimal"
							value={form.neckCircumference}
							onChange={(event) => setField('neckCircumference', event.target.value)}
						/>
					</Field>
					<Field>
						<span>Chest circumference</span>
						<input
							type="number"
							min="0"
							inputMode="decimal"
							value={form.chestCircumference}
							onChange={(event) => setField('chestCircumference', event.target.value)}
						/>
					</Field>
				</FieldGroup>
			</CollapsibleSection>

			{/* Health */}
			<CollapsibleSection title="Health" defaultOpen={Boolean(pet?.health)}>
				<FieldGroup>
					<Field>
						<span>Latest vaccination date</span>
						<input
							type="date"
							max={today}
							value={form.latestVaccinationDate}
							onChange={(event) => setField('latestVaccinationDate', event.target.value)}
						/>
					</Field>
					<Field>
						<span>Weight</span>
						<input
							type="number"
							min="0"
							inputMode="decimal"
							value={form.weight}
							onChange={(event) => setField('weight', event.target.value)}
						/>
					</Field>
				</FieldGroup>
			</CollapsibleSection>

			{/* Heat cycles — only shown for female pets */}
			{form.sex === 'female' ? (
				<CollapsibleSection
					title="Heat cycles"
					defaultOpen={heatCycles.some(hasHeatCycleValue)}
				>
					<HeatCycleGroup>
						{heatCycles.map((heatCycle, index) => (
							<HeatCycleCard key={index}>
								<HeatCycleHeader>
									<span>Heat cycle {index + 1}</span>
									{heatCycles.length > 1 ? (
										<RemoveButton
											type="button"
											onClick={() => removeHeatCycle(index)}
										>
											Remove
										</RemoveButton>
									) : null}
								</HeatCycleHeader>
								<Field>
									<span>Heat cycle start</span>
									<input
										type="date"
										value={heatCycle.startDate ?? ''}
										required={Boolean(heatCycle.endDate)}
										onChange={(event) =>
											updateHeatCycle(index, 'startDate', event.target.value)
										}
									/>
								</Field>
								<Field>
									<span>Heat cycle end</span>
									<input
										type="date"
										value={heatCycle.endDate ?? ''}
										required={Boolean(heatCycle.startDate)}
										min={heatCycle.startDate || undefined}
										onChange={(event) =>
											updateHeatCycle(index, 'endDate', event.target.value)
										}
									/>
								</Field>
								<StandingHeatGroup>
									<StandingHeatLabel>
										Standing heat <OptionalTag>(optional)</OptionalTag>
									</StandingHeatLabel>
									<Field>
										<span>Start</span>
										<input
											type="date"
											value={heatCycle.standingHeatStartDate ?? ''}
											required={Boolean(heatCycle.standingHeatEndDate)}
											onChange={(event) =>
												updateHeatCycle(index, 'standingHeatStartDate', event.target.value)
											}
										/>
									</Field>
									<Field>
										<span>End</span>
										<input
											type="date"
											value={heatCycle.standingHeatEndDate ?? ''}
											required={Boolean(heatCycle.standingHeatStartDate)}
											min={heatCycle.standingHeatStartDate || undefined}
											onChange={(event) =>
												updateHeatCycle(index, 'standingHeatEndDate', event.target.value)
											}
										/>
									</Field>
								</StandingHeatGroup>
							</HeatCycleCard>
						))}
						<AddButton type="button" onClick={addHeatCycle}>
							+ Add heat cycle
						</AddButton>
					</HeatCycleGroup>
				</CollapsibleSection>
			) : null}

			{/* Breeder information */}
			<CollapsibleSection
				title="Breeder information"
				defaultOpen={Boolean(pet?.breederInfo)}
			>
				<FieldGroup>
					<Field>
						<span>Breeder name</span>
						<input
							type="text"
							value={form.breederName}
							onChange={(event) => setField('breederName', event.target.value)}
						/>
					</Field>
					<Field>
						<span>Registered name</span>
						<input
							type="text"
							value={form.registeredName}
							onChange={(event) => setField('registeredName', event.target.value)}
						/>
					</Field>
					<Field>
						<span>SKK Hunddata link</span>
						<input
							type="url"
							value={form.skkHunddataUrl}
							onChange={(event) => setField('skkHunddataUrl', event.target.value)}
						/>
					</Field>
				</FieldGroup>
			</CollapsibleSection>

			<SubmitButton type="submit" disabled={isProcessingPicture}>
				{submitLabel}
			</SubmitButton>
		</Form>
	);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickDefined<T extends object>(obj: T): T | undefined {
	return Object.keys(obj).length > 0 ? obj : undefined;
}

function resizeImage(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		const imageUrl = URL.createObjectURL(file);

		image.onload = () => {
			URL.revokeObjectURL(imageUrl);

			const scale = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
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

// ─── Initial state ───────────────────────────────────────────────────────────

function getInitialFormState(pet?: Pet): FormState {
	return {
		// Basic information
		name: pet?.name ?? '',
		breed: pet?.breed ?? '',
		species: pet?.species ?? petType.dog,
		sex: pet?.sex ?? 'female',
		dateOfBirth: pet?.dateOfBirth ?? '',
		dateOfArrival: pet?.dateOfArrival ?? '',
		pictureUrl: pet?.pictureUrl,
		// Measurements
		height: pet?.measurements?.height?.toString() ?? '',
		backLength: pet?.measurements?.backLength?.toString() ?? '',
		neckCircumference: pet?.measurements?.neckCircumference?.toString() ?? '',
		chestCircumference: pet?.measurements?.chestCircumference?.toString() ?? '',
		// Health
		weight: pet?.health?.weight?.toString() ?? '',
		latestVaccinationDate: pet?.health?.latestVaccinationDate ?? '',
		// Breeder information
		breederName: pet?.breederInfo?.breederName ?? '',
		registeredName: pet?.breederInfo?.registeredName ?? '',
		skkHunddataUrl: pet?.breederInfo?.skkHunddataUrl ?? '',
	};
}

function getInitialHeatCycles(pet?: Pet): HeatCycle[] {
	return pet?.heatCycles?.length ? pet.heatCycles : [{}];
}

function hasHeatCycleValue(heatCycle: HeatCycle) {
	return Boolean(
		heatCycle.startDate ||
		heatCycle.endDate ||
		heatCycle.standingHeatStartDate ||
		heatCycle.standingHeatEndDate,
	);
}

// ─── Styled components ───────────────────────────────────────────────────────

const Form = styled.form({
	display: 'grid',
	gap: spacings.x4,
	width: '100%',
	maxWidth: '420px',
	boxSizing: 'border-box',
	borderRadius: '4px',
	backgroundColor: colors.white,
	padding: spacings.x4,
	border: `1px solid ${colors.blackBrown}`,
});

const FieldGroup = styled.div({
	display: 'flex',
	flexDirection: 'column',
	gap: spacings.x4,
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
	'& input:focus': {
		borderColor: colors.orange,
		outline: 'none',
	},
	'& input[type="file"]': {
		boxShadow: 'none',
		padding: spacings.x2,
	},
});

const ImageField = styled.div({
	display: 'grid',
	justifyItems: 'start',
	gap: '6px',
	...typography.body,
	'& > span': {
		fontWeight: 500,
	},
});

const ImageUploadTile = styled.label({
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

const SectionContent = styled.div({
	display: 'grid',
	gap: spacings.x4,
	marginTop: spacings.x3,
	border: `1px solid ${colors.darkBeige}`,
	borderRadius: '4px',
	backgroundColor: '#fbf8f4',
	padding: spacings.x3,
});

const HeatCycleGroup = styled.div({
	display: 'grid',
	gap: spacings.x3,
});

const HeatCycleCard = styled.div({
	display: 'grid',
	gap: spacings.x3,
	border: `1px solid ${colors.darkBeige}`,
	borderRadius: '4px',
	padding: spacings.x3,
});

const HeatCycleHeader = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: spacings.x3,
	...typography.body,
	fontWeight: 700,
});

const StandingHeatGroup = styled.div({
	display: 'grid',
	gap: spacings.x3,
	paddingTop: spacings.x2,
	borderTop: `1px solid ${colors.darkBeige}`,
});

const StandingHeatLabel = styled.span({
	...typography.body,
	fontWeight: 700,
});

const OptionalTag = styled.span({
	...typography.meta,
	fontWeight: 400,
	color: colors.warmBrown,
});

const AddButton = styled.button({
	justifySelf: 'start',
	border: `1px solid ${colors.warmBrown}`,
	borderRadius: '4px',
	backgroundColor: colors.white,
	color: colors.warmBrown,
	cursor: 'pointer',
	font: 'inherit',
	fontSize: '12px',
	fontWeight: 700,
	padding: `${spacings.x2} ${spacings.x3}`,
});

const RemoveButton = styled.button({
	border: 0,
	backgroundColor: 'transparent',
	color: '#8a3d3d',
	cursor: 'pointer',
	font: 'inherit',
	fontWeight: 700,
	padding: 0,
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
	marginTop: spacings.x6,
	'&:disabled': {
		cursor: 'not-allowed',
		opacity: 0.7,
	},
});
