// Allowed pet types for the first version of the app.
export const petType = {
	dog: 'dog',
	cat: 'cat',
} as const;

export type PetSpecies = (typeof petType)[keyof typeof petType];

// The shape of one pet record as it will be stored in IndexedDB.
export type Pet = {
	id: string;
	name: string;
	// sex: 'female' | 'male';
	species: PetSpecies;
	breed: string;
	age: number; //should be counted from birthaday
	pictureUrl?: string;
	// medicalHistory: string These will be included in the future
	// heatPeriods: string // This need to be of type Date and selected from a calendar
	createdAt: string;
	updatedAt: string;
};
