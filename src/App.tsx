import Layout from './components/Layout';
import PetProfile from './components/PetProfile';
import { petType, type Pet } from './db';

const pet: Pet = {
	id: '1',
	name: 'Nora',
	species: petType.dog,
	breed: 'Bichon Havanais',
	age: 4,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

function App() {
	return (
		<Layout>
			<PetProfile pet={pet} />
		</Layout>
	);
}

export default App;
