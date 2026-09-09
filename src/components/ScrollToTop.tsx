import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets the window scroll position to the top whenever the route changes,
// so opening a new page (e.g. PetDetails from a scrolled PetsOverview) always
// starts from the top instead of keeping the previous scroll offset.
export default function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}
