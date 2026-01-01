import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '5b6a578d189a25e84cb5687605d7ed24'; // Fallback if env not loaded yet
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const tmdbClient = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    }
});

export const searchMovie = async (query) => {
    try {
        if (!query) return null;
        const response = await tmdbClient.get('/search/movie', {
            params: {
                query: query,
                include_adult: false,
                language: 'en-US',
                page: 1
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            const movie = response.data.results[0]; // Get the first/best match
            return {
                id: movie.id,
                title: movie.title,
                original_title: movie.original_title,
                poster_path: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                release_date: movie.release_date,
                overview: movie.overview,
                vote_average: movie.vote_average
            };
        }
        return null; // No results found
    } catch (error) {
        console.error(`Error searching for movie "${query}":`, error);
        return null;
    }
};
