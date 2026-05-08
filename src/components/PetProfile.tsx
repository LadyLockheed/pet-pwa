import styled from 'styled-components';
import type { Pet } from '../db';

interface PetProfileProps {
	pet: Pet;
}

export default function PetProfile({ pet }: PetProfileProps) {
	const petDetails = [
		['Breed', pet.breed],
		['Age', pet.age],
	];

	return (
		<Profile>
			<Card>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<Name>{pet.name}</Name>
					<PicturePlaceholder />
				</div>
				<DetailsList>
					{petDetails.map(([label, value]) => (
						<li key={label}>
							<strong>{label}:</strong> {value}
						</li>
					))}
				</DetailsList>
			</Card>
		</Profile>
	);
}

const Profile = styled.section({
	margin: '24px',
});

const Name = styled.h1({
	margin: '0 0 16px',
	fontSize: '2rem',
	textAlign: 'center',
});

const Card = styled.article({
	padding: '24px',
	border: '1px solid #d7c7f2',
	borderRadius: '8px',
	backgroundColor: '#ffffff',
});

const PicturePlaceholder = styled.div({
	width: '180px',
	aspectRatio: '1',
	flexShrink: 0,
	border: '2px dashed #b9a1df',
	borderRadius: '8px',
	backgroundColor: '#f7f2ff',
});

const DetailsList = styled.ul({
	margin: 0,
	paddingLeft: '20px',
	lineHeight: 1.8,
});
