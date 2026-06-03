import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../types/pet';
import { formatAgeFromDateOfBirth } from '../utils/petAge';

import HeatCycleTimeline from './HeatCycleTimeline';
import { colors } from '../styles/colors';
import CollapsibleSection from './CollapsibleSection';
import PageHeader from './PageHeader';
import { Pencil, Trash } from 'lucide-react';
import { spacings } from '../styles/spacings';
import PicturePlaceholder from './PicturePlaceholder';
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
			<>
				<PageHeader
					to="/"
					label="Back to pets overview"
					title={'Pet not found'}
				/>
				<Details>
					<Link to="/">Back to pets</Link>
				</Details>
			</>
		);
	}

	async function handleDelete() {
		if (!pet) {
			return;
		}
		const shouldDelete = window.confirm(`Delete ${pet.name}?`);

		if (!shouldDelete) {
			return;
		}

		await onDeletePet(pet.id);
		navigate('/');
	}

	function formatWeight(value?: number) {
		return value ? `${value} kg` : undefined;
	}

	const petDetails = [
		['Species', pet.species],
		['Sex', pet.sex],
		['Breed', pet.breed],
		['Date of birth', pet.dateOfBirth || 'Unknown'],
		['Age', formatAgeFromDateOfBirth(pet.dateOfBirth)],
	];

	const measurementDetails = [
		['Height', formatMeasurement(pet.measurements?.height)],
		['Back length', formatMeasurement(pet.measurements?.backLength)],
		[
			'Neck circumference',
			formatMeasurement(pet.measurements?.neckCircumference),
		],
	].filter(([, value]) => value);

	const healthDetails = [
		['Latest vaccination', pet.health?.latestVaccinationDate],
		['Weight', formatWeight(pet.health?.weight)],
	].filter(([, value]) => value);

	const heatCycles = pet.heatCycles ?? [];

	const breederDetails = [
		['Breeder', pet.breederInfo?.breederName],
		['SKK Hunddata', pet.breederInfo?.skkHunddataUrl],
	].filter(([, value]) => value);

	return (
		<>
			<PageHeader to="/" label={'back to previous page'} title={''} />
			<Details>
				<PictureContainer>
					{pet.pictureUrl ? (
						<PetPicture src={pet.pictureUrl} alt={pet.name} />
					) : (
						<PicturePlaceholder species={pet.species} />
					)}
				</PictureContainer>

				<InnerDetailsCard>
					<Header>
						<Name>{pet.name}</Name>
						<ActionBar>
							<IconLink
								to={`/pets/${pet.id}/edit`}
								aria-label={`Edit ${pet.name}`}
							>
								<Pencil size={18} />
							</IconLink>
							<IconButton
								type="button"
								onClick={handleDelete}
								aria-label={`Delete ${pet.name}`}
							>
								<Trash size={18} />
							</IconButton>
						</ActionBar>
					</Header>

					<SectionTitle>Basic information</SectionTitle>
					<ValuesGrid>
						{petDetails.map(([label, value]) => (
							<Values key={label}>
								<Label>{label}</Label>
								<Value>{value}</Value>
							</Values>
						))}
					</ValuesGrid>

					{measurementDetails.length > 0 ? (
						<DetailsCollapsibleSection title="Measurements">
							<ValuesGrid>
								{measurementDetails.map(([label, value]) => (
									<Values key={label}>
										<Label>{label}</Label>
										<Value>{value}</Value>
									</Values>
								))}
							</ValuesGrid>
						</DetailsCollapsibleSection>
					) : null}

					{healthDetails.length > 0 ? (
						<DetailsCollapsibleSection title="Health">
							<ValuesGrid>
								{healthDetails.map(([label, value]) => (
									<Values key={label}>
										<Label>{label}</Label>
										<Value>{value}</Value>
									</Values>
								))}
							</ValuesGrid>
						</DetailsCollapsibleSection>
					) : null}

					{pet.sex === 'female' && heatCycles.length > 0 ? (
						<DetailsCollapsibleSection title="Heat cycles">
							<HeatCycleTimeline heatCycles={heatCycles} />
						</DetailsCollapsibleSection>
					) : null}

					{breederDetails.length > 0 ? (
						<DetailsCollapsibleSection title="Breeder information">
							<ValuesGrid>
								{breederDetails.map(([label, value]) => (
									<Values key={label}>
										<Label>{label}</Label>
										<Value>
											{label === 'SKK Hunddata' ? (
												<ExternalLink
													href={value}
													target="_blank"
													rel="noreferrer"
												>
													Open link
												</ExternalLink>
											) : (
												value
											)}
										</Value>
									</Values>
								))}
							</ValuesGrid>
						</DetailsCollapsibleSection>
					) : null}
				</InnerDetailsCard>
			</Details>
		</>
	);
}

function formatMeasurement(value?: number) {
	return value ? `${value} cm` : undefined;
}

const Details = styled.section({
	display: 'grid',
	gap: '16px',
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	borderRadius: '4px',
});

const PictureContainer = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const PetPicture = styled.img({
	width: '100%',
	aspectRatio: '1',
	borderRadius: '8px',
	objectFit: 'cover',
});

const InnerDetailsCard = styled.div({
	backgroundColor: colors.cardBg,
	padding: spacings.x4,
	borderRadius: '8px',
});

const Header = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	marginBottom: spacings.x6,
});

const ActionBar = styled.div({
	display: 'flex',
	gap: spacings.x4,
});

const Values = styled.div({
	display: 'flex',
	flexDirection: 'column',
	gap: spacings.x1,
	// marginBottom: spacings.x3,
	// backgroundColor: colors.background,
	paddingBottom: spacings.x3,
	// borderRadius: '8px',
});

const Name = styled.h1({
	color: colors.white,
	// marginLeft: spacings.x4,
	margin: 0,
});

const Label = styled.div({
	color: colors.warmGrey,
	textTransform: 'uppercase',
	fontSize: 12,
});

const Value = styled.div({
	color: colors.warmWhite,
	fontSize: 16,
	textTransform: 'capitalize',
});

const iconControlStyles = {
	display: 'grid',
	placeItems: 'center',
	backgroundColor: 'transparent',
	color: colors.warmGrey,
	cursor: 'pointer',
	padding: spacings.x1,
	textDecoration: 'none',
	border: 'none',
	WebkitTapHighlightColor: 'transparent',
	'&:focus': {
		outline: 'none',
	},
	'&:focus-visible': {
		outline: `2px solid ${colors.orange}`,
		outlineOffset: '2px',
	},
} as const;

const IconButton = styled.button(iconControlStyles);

const IconLink = styled(Link)(iconControlStyles);

const ValuesGrid = styled.section({
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gap: spacings.x2,
	width: '100%',
	marginBottom: spacings.x4,
});

const SectionTitle = styled.h2({
	margin: 0,
	fontSize: '16px',
	color: colors.orange,
	textTransform: 'uppercase',
	marginBottom: spacings.x4,
});

const DetailsCollapsibleSection = styled(CollapsibleSection)({
	width: '100%',
	maxWidth: '420px',
});

const ExternalLink = styled.a({
	color: '#2f6f73',
	fontWeight: 800,
});
