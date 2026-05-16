import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import AddPetForm from './components/AddPetForm';
import PetsOverview from './components/PetsOverview';
import { deletePet as deletePetFromDb, getPets, savePet } from './db';
import About from './components/About';
import PetDetails from './components/PetDetails';
import type { Pet } from './types/pet';

//TODO byt ut age till födelsedag och visa ålder utifrån den istället
//TODO Gå igenom alla componetnter och städa upp

//TODO Lägg till en "INGA PETS ÄNNU" vy

function App() {
	const [pets, setPets] = useState<Pet[]>([]);

	useEffect(() => {
		let ignoreResult = false;

		async function loadPets() {
			const storedPets = await getPets();

			if (!ignoreResult) {
				setPets(storedPets);
			}
		}

		loadPets();

		return () => {
			ignoreResult = true;
		};
	}, []);

	async function handleDeletePet(petId: string) {
		await deletePetFromDb(petId);
		setPets((currentPets) =>
			currentPets.filter((currentPet) => currentPet.id !== petId),
		);
	}

	async function handleAddPet(pet: Pet) {
		await savePet(pet);
		setPets((currentPets) => [...currentPets, pet]);
	}

	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" element={<PetsOverview pets={pets} />} />
					<Route
						path="/add-pet"
						element={<AddPetForm onAddPet={handleAddPet} />}
					/>
					<Route path="/pets-overview" element={<Navigate to="/" replace />} />
					<Route path="/about" element={<About />} />
					<Route
						path="/pets/:petId"
						element={<PetDetails pets={pets} onDeletePet={handleDeletePet} />}
					/>
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}

export default App;
