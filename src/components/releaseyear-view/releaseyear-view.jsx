import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, finishLoading } from '../../actions/progressAction';

import { MovieCard } from '../movie-card/movie-card';

export const ReleaseYear = ({ favourites = [], onToggleFavourite }) => {
	const { year } = useParams();
	const [movies, setMovies] = useState([]);
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.loading);

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				dispatch(startLoading());

				const token = localStorage.getItem('token');
				const response = await fetch(
					`https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies/release-year/${year}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
					}
				);
				const data = await response.json();
				if (response.ok && Array.isArray(data) && data.length > 0) {
					const updatedMovies = data.map((movie) => ({
						...movie,
						id: movie._id,
					}));
					setMovies(updatedMovies);
					setError('');
				} else {
					setMovies([]);
					setError('');
				}
			} catch (err) {
				setMovies([]);
				setError(`There was an error fetching movies by release year "${year}"`);
			} finally {
				dispatch(finishLoading());
			}
		};

		fetchMovies();
	}, [year, dispatch]);

	return (
		<>
			<h3>Movies Released in {year}</h3>
			{error && <p>{error}</p>}
			<Row className='g-3 mb-5 d-flex justify-content-center'>
				{loading ? (
					// Spinner while loading
					<Col xs='auto'>
						<Spinner
							animation='grow'
							role='status'>
							<span className='visually-hidden'>Loading...</span>
						</Spinner>
					</Col>
				) : (
					movies.map((releaseYearMovie) => (
						<Col
							key={releaseYearMovie.id}
							sm={6}
							md={4}
							lg={3}>
							<MovieCard
								movie={releaseYearMovie}
								isFavourite={favourites.some((fav) => fav.movieId === releaseYearMovie.id)}
								onToggleFavourite={onToggleFavourite}
							/>
						</Col>
					))
				)}
			</Row>
		</>
	);
};

ReleaseYear.propTypes = {
	favourites: PropTypes.array.isRequired,
	onToggleFavourite: PropTypes.func.isRequired,
};
