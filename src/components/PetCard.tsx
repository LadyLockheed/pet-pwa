import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors } from '../styles/colors';
import { spacings } from '../styles/spacings';
import type { Pet } from '../types/pet';
import { formatAgeFromDateOfBirth } from '../utils/petAge';
import PicturePlaceholder from './PicturePlaceholder';

interface PetCardProps {
	pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
	return (
		<CardLink to={`/pets/${pet.id}`}>
			<PetSummary>
				<TopRow>
					<Name>{pet.name}</Name>
					<SpeciesPill>{pet.species}</SpeciesPill>
				</TopRow>

				<BottomRow>
					<Breed>{pet.breed}</Breed>
					<Separator aria-hidden="true" />
					<span>{formatAgeFromDateOfBirth(pet.dateOfBirth)}</span>
				</BottomRow>
			</PetSummary>

			<ImageContainer>
				{pet.pictureUrl ? (
					<PetPicture src={pet.pictureUrl} alt={pet.name} />
				) : (
					<PicturePlaceholder species={pet.species} />
				)}
			</ImageContainer>

			<DetailsArrow>
				<MoveRight size={20} style={{ color: colors.warmWhite }} />
			</DetailsArrow>
		</CardLink>
	);
}

const CardLink = styled(Link)({
	display: 'flex',
	flexDirection: 'column',
	gap: spacings.x4,
	padding: spacings.x4,
	border: `1px solid ${colors.coldBrown}`,
	borderRadius: '8px',
	backgroundColor: colors.cardBg,
	color: 'inherit',
	textDecoration: 'none',
});

const TopRow = styled.div({
	display: 'flex',
	justifyContent: 'space-between',
	width: '100%',
	alignItems: 'center',
});

const BottomRow = styled.div({
	display: 'flex',
	alignItems: 'center',
	gap: spacings.x1,
	fontSize: '12px',
	fontWeight: 200,
	whiteSpace: 'nowrap',
	color: colors.white,
	opacity: '80%',
});

const Breed = styled.span({
	fontSize: '12px',
	textTransform: 'uppercase',
});

const Separator = styled.span({
	display: 'inline-block',
	width: '2px',
	height: '2px',
	borderRadius: '999px',
	backgroundColor: colors.vibrantOrange,
});

const PetPicture = styled.img({
	width: '100%',
	aspectRatio: '1',
	borderRadius: spacings.x2,
	objectFit: 'cover',
});

const PetSummary = styled.div({
	display: 'flex',
	flexDirection: 'column',
	gap: spacings.x2,
});

const Name = styled.h1({
	margin: 0,
	fontFamily: "'Roboto', ui-sans-serif, system-ui, sans-serif",
	fontSize: '1.5rem',
	fontWeight: 700,
	lineHeight: 1.1,
	color: colors.white,
});

const DetailsArrow = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: spacings.x2,
	// maxHeight: spacings.x2,
	padding: `${spacings.x05} ${spacings.x1}`,
	borderRadius: spacings.x1,
	backgroundColor: colors.orange,
	color: colors.warmWhite,
});

const ImageContainer = styled.div({
	display: 'flex',
	flexDirection: 'column',
	gap: spacings.x1,
	// justifyItems: 'center',
	width: '100%',
	// textAlign: 'center',
});

const SpeciesPill = styled.div({
	borderRadius: '4px',
	maxWidth: '50px',
	textTransform: 'uppercase',
	border: `1px solid ${colors.coldBrown}`,
	color: colors.white,
	fontSize: '10px',
	padding: spacings.x1,
});
