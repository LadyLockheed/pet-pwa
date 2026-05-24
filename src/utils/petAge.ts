export function formatAgeFromDateOfBirth(dateOfBirth?: string) {
	if (!dateOfBirth) {
		return 'Unknown';
	}

	const birthDate = new Date(`${dateOfBirth}T00:00:00`);

	if (Number.isNaN(birthDate.getTime())) {
		return 'Unknown';
	}

	const today = new Date();
	let years = today.getFullYear() - birthDate.getFullYear();
	let months = today.getMonth() - birthDate.getMonth();

	if (today.getDate() < birthDate.getDate()) {
		months -= 1;
	}

	if (months < 0) {
		years -= 1;
		months += 12;
	}

	if (years < 0) {
		return 'Unknown';
	}

	const yearText = years === 1 ? '1 year' : `${years} years`;
	const monthText = months === 1 ? '1 month' : `${months} months`;

	return `${yearText}, ${monthText}`;
}

export function formatDateFromDateOfBirth(dateOfBirth?: string) {
	if (!dateOfBirth) {
		return 'Unknown';
	}

	const [year, month, day] = dateOfBirth.split('-');

	if (!year || !month || !day) {
		return 'Unknown';
	}

	return `${Number(day)}/${Number(month)}-${year.slice(-2)}`;
}
