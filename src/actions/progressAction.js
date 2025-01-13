/*
 * action types
 */

export const START_LOADING = 'START_LOADING';
export const FINISH_LOADING = 'FINISH_LOADING';

/*
 * action creators
 */
export const startLoading = () => ({
	type: START_LOADING,
});

export const finishLoading = () => ({
	type: FINISH_LOADING,
});
