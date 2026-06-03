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
const MAX_IMAGE_SIZE = 1024;
const IMAGE_QUALITY = 0.8;
const MAX_ORIGINAL_FILE_SIZE = 25 * 1024 * 1024;
const emptyHeatCycle: HeatCycle = {};

interface PetFormProps {
	pet?: Pet;
	submitLabel: string;
	onSubmit: (pet: Pet) => Promise<void>;
}
//TODO ska man flytta allt detta nån annanstans?
// TODO se över där den satt ett defaultvärde, tex om man inte valt species, så sätter den dog som default, fel.

// TODO Validation, tex föredatum får inte vara efter sista datum för heat
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
	const [height, setHeight] = useState(
		pet?.measurements?.height?.toString() ?? '',
	);
	const [backLength, setBackLength] = useState(
		pet?.measurements?.backLength?.toString() ?? '',
	);
	const [neckCircumference, setNeckCircumference] = useState(
		pet?.measurements?.neckCircumference?.toString() ?? '',
	);
	const [weight, setWeight] = useState(pet?.health?.weight?.toString() ?? '');
	const [latestVaccinationDate, setLatestVaccinationDate] = useState(
		pet?.health?.latestVaccinationDate ?? '',
	);
	const [heatCycles, setHeatCycles] = useState<HeatCycle[]>(
		getInitialHeatCycles(pet),
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
		const savedHeatCycles = getHeatCycles();
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
			...(savedHeatCycles ? { heatCycles: savedHeatCycles } : {}),
			...(breederInfo ? { breederInfo } : {}),
			createdAt: pet?.createdAt ?? now,
			updatedAt: now,
		});
	}

	function getMeasurements(): PetMeasurements | undefined {
		const measurements: PetMeasurements = {};
		if (height) measurements.height = Number(height);
		if (backLength) measurements.backLength = Number(backLength);
		if (neckCircumference)
			measurements.neckCircumference = Number(neckCircumference);
		return pickDefined(measurements);
	}

	function getHealth(): PetHealth | undefined {
		const health: PetHealth = {};
		if (latestVaccinationDate)
			health.latestVaccinationDate = latestVaccinationDate;
		if (weight) health.weight = Number(weight);
		return pickDefined(health);
	}

	function getHeatCycles(): HeatCycle[] | undefined {
		if (sex !== 'female') {
			return undefined;
		}

		const savedHeatCycles = heatCycles
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

		return savedHeatCycles.length > 0 ? savedHeatCycles : undefined;
	}

	function updateHeatCycle(
		index: number,
		field: keyof HeatCycle,
		value: string,
	) {
		setHeatCycles((currentHeatCycles) =>
			currentHeatCycles.map((heatCycle, heatCycleIndex) =>
				heatCycleIndex === index
					? {
							...heatCycle,
							[field]: value,
						}
					: heatCycle,
			),
		);
	}

	function addHeatCycle() {
		setHeatCycles((currentHeatCycles) => [
			...currentHeatCycles,
			{ ...emptyHeatCycle },
		]);
	}

	function removeHeatCycle(index: number) {
		setHeatCycles((currentHeatCycles) => {
			const nextHeatCycles = currentHeatCycles.filter(
				(_, heatCycleIndex) => heatCycleIndex !== index,
			);

			return nextHeatCycles.length > 0
				? nextHeatCycles
				: [{ ...emptyHeatCycle }];
		});
	}

	function getBreederInfo(): PetBreederInfo | undefined {
		const breederInfo: PetBreederInfo = {};
		if (breederName.trim()) breederInfo.breederName = breederName.trim();
		if (skkHunddataUrl.trim())
			breederInfo.skkHunddataUrl = skkHunddataUrl.trim();
		return pickDefined(breederInfo);
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
						required
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

			<SectionContent>
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
			</SectionContent>

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

			<CollapsibleSection
				title="Measurements"
				defaultOpen={Boolean(pet?.measurements)}
			>
				<Field>
					<span>Height</span>
					<input
						type="number"
						min="0"
						inputMode="decimal"
						value={height}
						onChange={(event) => setHeight(event.target.value)}
					/>
				</Field>
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
			</CollapsibleSection>

			<CollapsibleSection title="Health" defaultOpen={Boolean(pet?.health)}>
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
					<span>Weight</span>
					<input
						type="number"
						min="0"
						inputMode="decimal"
						value={weight}
						onChange={(event) => setWeight(event.target.value)}
					/>
				</Field>
			</CollapsibleSection>

			{sex === 'female' ? (
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
									<StandingHeatLabel>Standing heat <OptionalTag>(optional)</OptionalTag></StandingHeatLabel>
									<Field>
										<span>Start</span>
										<input
											type="date"
											value={heatCycle.standingHeatStartDate ?? ''}
											required={Boolean(heatCycle.standingHeatEndDate)}
											onChange={(event) =>
												updateHeatCycle(
													index,
													'standingHeatStartDate',
													event.target.value,
												)
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
												updateHeatCycle(
													index,
													'standingHeatEndDate',
													event.target.value,
												)
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

			<CollapsibleSection
				title="Breeder information"
				defaultOpen={Boolean(pet?.breederInfo)}
			>
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
			</CollapsibleSection>

			<SubmitButton type="submit" disabled={isProcessingPicture}>
				{submitLabel}
			</SubmitButton>
		</Form>
	);
}

function pickDefined<T extends object>(obj: T): T | undefined {
	return Object.keys(obj).length > 0 ? obj : undefined;
}

function getInitialHeatCycles(pet?: Pet) {
	const heatCycles = pet?.heatCycles;

	if (heatCycles && heatCycles.length > 0) {
		return heatCycles;
	}

	return [{ ...emptyHeatCycle }];
}

function hasHeatCycleValue(heatCycle: HeatCycle) {
	return Boolean(
		heatCycle.startDate ||
		heatCycle.endDate ||
		heatCycle.standingHeatStartDate ||
		heatCycle.standingHeatEndDate,
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
	border: `1px solid ${colors.blackBrown}`,
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
	border: `1px solid ${colors.darkBeige}`,
	borderRadius: '4px',
	backgroundColor: colors.white,
	color: colors.warmBrown,
	cursor: 'pointer',
	font: 'inherit',
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
	'&:disabled': {
		cursor: 'not-allowed',
		opacity: 0.7,
	},
});
