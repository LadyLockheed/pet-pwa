import styled from 'styled-components';
import { useState } from 'react';
import { getPets, importPets } from '../db';
import type { Pet } from '../types/pet';
import { spacings } from '../styles/spacings';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export default function Settings() {
	const [importStatus, setImportStatus] = useState('');

	async function handleExport() {
		const pets = await getPets();
		const json = JSON.stringify(pets, null, 2);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'pets.json';
		link.click();
		URL.revokeObjectURL(url);
	}

	async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const pets = JSON.parse(text) as Pet[];
			if (!Array.isArray(pets)) throw new Error();
			await importPets(pets);
			setImportStatus('Import successful!');
		} catch {
			setImportStatus(
				'Could not read the file. Make sure it is a valid pets export.',
			);
		}

		event.target.value = '';
	}

	return (
		<Page>
			<Title>Export/import data</Title>
			<SectionWrapper>
				{/* About data storage */}
				<Section>
					<SectionTitle>Your data</SectionTitle>
					<Body>
						All your pet data is saved locally on this device and never sent to
						any server. This means your data is private, but it also means it
						only exists on this phone. Use the export and import features below
						to back up your data or move it to a new device.
					</Body>
				</Section>

				{/* Export */}
				<Section>
					<SectionTitle>Export</SectionTitle>
					<Body>
						Download all your pet data as a file. You can save it as a backup or
						share it with yourself to move to a new phone via email, WhatsApp,
						AirDrop, Google Drive, or iCloud.
					</Body>
					<Button onClick={handleExport}>Export pets</Button>
				</Section>

				{/* Import */}
				<Section>
					<SectionTitle>Import</SectionTitle>
					<Body>
						Restore pet data from a previously exported file. On your new phone,
						download the file you shared with yourself, then tap the button
						below and select it. Any pets with the same ID will be overwritten.
					</Body>
					<label>
						<Button as="span">Import pets</Button>
						<HiddenInput type="file" accept=".json" onChange={handleImport} />
					</label>
					{importStatus ? <StatusMessage>{importStatus}</StatusMessage> : null}
				</Section>
			</SectionWrapper>
		</Page>
	);
}

const Page = styled.div({
	display: 'flex',
	flexDirection: 'column',
	gap: '110px',
	width: '100%',
	maxWidth: '420px',
	padding: '12px',
	alignItems: 'center',
});

const Title = styled('h1')({
	fontFamily: "'EB Garamond', Georgia, serif",
	fontWeight: 700,
	color: colors.background,
	margin: 0,
	marginBottom: spacings.x4,
});

const SectionWrapper = styled.div({
	display: 'flex',
	flexDirection: 'column',
	gap: spacings.x4,
});

const Section = styled.section({
	display: 'grid',
	gap: spacings.x3,
	paddingTop: spacings.x4,
	borderTop: `1px solid ${colors.coldBrown}`,
});

const SectionTitle = styled.h2({
	margin: 0,
	fontSize: '16px',
	color: colors.orange,
	textTransform: 'uppercase',
	letterSpacing: '0.08em',
});

const Body = styled.p({
	...typography.body,
	margin: 0,
	color: colors.warmGrey,
});

const Button = styled.button({
	justifySelf: 'start',
	border: `1px solid ${colors.brandMint}`,
	borderRadius: '4px',
	backgroundColor: 'transparent',
	color: colors.warmWhite,
	cursor: 'pointer',
	font: 'inherit',
	fontWeight: 700,
	padding: `${spacings.x2} ${spacings.x3}`,
});

const HiddenInput = styled.input({
	display: 'none',
});

const StatusMessage = styled.p({
	margin: 0,
	color: colors.warmGrey,
	...typography.meta,
});
