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
	species: PetSpecies;
	breed: string;
	age: number;
	pictureUrl?: string;
	// medicalHistory: string These will be included in the future
	// heatPeriods: string // This need to be of type Date and selected from a calendar
	createdAt: string;
	updatedAt: string;
};

// IndexedDB database settings. Increase DB_VERSION later if the store structure changes.
const DB_NAME = 'pet-journal';
const DB_VERSION = 1;
const PET_STORE = 'pets';

// Opens the browser's local IndexedDB database and creates the "pets" store
// the first time this app version runs.
function openPetDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		// Runs only when the database is first created or when DB_VERSION is increased.
		request.onupgradeneeded = () => {
			const db = request.result;

			// keyPath: "id" means each pet is saved and found by its id field.
			if (!db.objectStoreNames.contains(PET_STORE)) {
				db.createObjectStore(PET_STORE, { keyPath: 'id' });
			}
		};

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
	});
}

// Small helper that opens the database, starts a transaction, runs one store
// operation, and converts IndexedDB's event API into a Promise.
async function withPetStore<T>(
	mode: IDBTransactionMode,
	callback: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
	const db = await openPetDb();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(PET_STORE, mode);
		const request = callback(transaction.objectStore(PET_STORE));

		// Resolve or reject based on the specific IndexedDB request result.
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);

		// Close the database connection when the transaction finishes.
		transaction.oncomplete = () => db.close();
		transaction.onerror = () => reject(transaction.error);
	});
}

// Reads every saved pet and returns the oldest records first.
export async function getPets(): Promise<Pet[]> {
	const pets = await withPetStore<Pet[]>('readonly', (store) => store.getAll());

	return pets.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

// Adds a new pet or replaces an existing pet with the same id.
export async function savePet(pet: Pet): Promise<Pet> {
	await withPetStore<IDBValidKey>('readwrite', (store) => store.put(pet));

	return pet;
}

// Deletes one pet record by id.
export function deletePet(id: string): Promise<undefined> {
	return withPetStore<undefined>('readwrite', (store) => store.delete(id));
}
