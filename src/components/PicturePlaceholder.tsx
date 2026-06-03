import styled from 'styled-components';
import { colors } from '../styles/colors';
import { Cat, Dog } from 'lucide-react';

interface PicturePlaceholderProps {
	species: string;
}

export default function PicturePlaceholder({
	species,
}: PicturePlaceholderProps) {
	return (
		<PicturePlaceholderContainer>
			{species === 'dog' ? <Dog size={70} /> : <Cat size={70} />}
		</PicturePlaceholderContainer>
	);
}

const PicturePlaceholderContainer = styled.div({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '100%',
	aspectRatio: '1',
	flexShrink: 0,
	border: `2px dashed ${colors.warmGrey}`,
	borderRadius: '8px',
	backgroundColor: '#f7f2ff',
});
