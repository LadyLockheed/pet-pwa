// Allowed pet types for the first version of the app.
export const petType = {
	dog: 'dog',
	cat: 'cat',
} as const;

export type PetSpecies = (typeof petType)[keyof typeof petType];

export type PetSex = 'female' | 'male';

export type PetMeasurements = {
	height?: number;
	backLength?: number;
	neckCircumference?: number;
};

export type HeatCycle = {
	startDate?: string;
	endDate?: string;
	standingHeatStartDate?: string;
	standingHeatEndDate?: string;
};

export type PetHealth = {
	latestVaccinationDate?: string;
	weight?: number;
};

export type PetBreederInfo = {
	breederName?: string;
	skkHunddataUrl?: string;
};

// The shape of one pet record as it will be stored in IndexedDB.
export type Pet = {
	id: string;
	name: string;
	sex?: PetSex;
	species: PetSpecies;
	breed: string;
	dateOfBirth: string;
	pictureUrl?: string;
	measurements?: PetMeasurements;
	health?: PetHealth;
	heatCycles?: HeatCycle[];
	breederInfo?: PetBreederInfo;
	// medicalHistory: string These will be included in the future
	createdAt: string;
	updatedAt: string;
};
