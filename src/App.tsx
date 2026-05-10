import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import AddPetForm from './components/AddPetForm';
import PetsOverview from './components/PetsOverview';
import { petType, type Pet } from './db';
import About from './components/About';
import PetDetails from './components/PetDetails';

//TODO byt ut age till födelsedag och visa ålder utifrån den istället

const initialPets: Pet[] = [
	{
		id: '1',
		name: 'Nora',
		species: petType.dog,
		breed: 'Bichon Havanais',
		age: 4,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: '2',
		name: 'Tilda',
		species: petType.dog,
		breed: 'Bichon Havanais',
		age: 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

function App() {
	const [pets, setPets] = useState(initialPets);

	function handleDeletePet(petId: string) {
		setPets((currentPets) =>
			currentPets.filter((currentPet) => currentPet.id !== petId),
		);
	}

	function handleAddPet(pet: Pet) {
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
