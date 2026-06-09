import styled from 'styled-components';
import heroImage from '../assets/IMG-20250617-WA0020.jpg';
import { colors } from '../styles/colors';
import { spacings } from '../styles/spacings';
import { typography } from '../styles/typography';

export default function About() {
	return (
		<Page>
			<HeroImage src={heroImage} alt="" />
			<Content>
				<Title>Good to know</Title>
				<Body>Lorem ipsum</Body>
				<Body>
					Informationen man lägger in om sitt husdjur sparas på telefonen. Tänk
					därför på att om du byter telefon så försvinner informationen.
				</Body>
				<Title>About</Title>
				<Body>
					Idén till den här appen dök upp när jag stod hos veterinären och de
					ställde frågor om försäkringsbolag, vikt, senaste löp och annat. Jag
					hade såklart ingen koll på nåt av det där. Istället för att skriva ner
					all information lite löst på lappar och notisappar så ville jag bygga
					min egen app för all denna information. Det är min bichon havanais
					Nora på bilden. Det är hon som har inspirerat till färgerna i appen.
				</Body>
				<Body>
					Det har också varit ett tillfälle att få grotta ytterligare i kod och
					få prova på att bygga en PWA (progressive web app). För er som inte
					vet vad en PWA är så är det en app man kan använda och ladda ner via
					en vanlig webbläsare. Man behöver heller inte ladda ner den om man
					inte vill, man kan använda den i webbläsaren direkt. Informationen man
					lägger in om sitt husdjur sparas på telefonen. Så det kan vara bra att
					veta att om man byter telefon försvinner informationen
				</Body>
			</Content>
		</Page>
	);
}

const Page = styled.section({
	display: 'grid',
	width: '100%',
	maxWidth: '720px',
	boxSizing: 'border-box',
	gap: spacings.x4,
});

const HeroImage = styled.img({
	width: '100%',
	aspectRatio: '8S / 9',
	objectFit: 'cover',
	borderRadius: '8px',
});

const Content = styled.div({
	display: 'grid',
	gap: spacings.x4,
	padding: `0 ${spacings.x2}`,
});

const Title = styled.h1({
	margin: 0,
	color: colors.warmWhite,
});

const Body = styled.p({
	...typography.body,
	margin: 0,
	color: colors.warmGrey,
});
