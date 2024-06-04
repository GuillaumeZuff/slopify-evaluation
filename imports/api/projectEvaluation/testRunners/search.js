import _ from "underscore";
import {
    createUser,
    deleteUser,
    testError,
    testFailed,
    testPassed,
    runQuery,
} from "./helpers";

const SEARCH_SPOTIFY = `
    mutation searchSpotify($query: String!, $market: String!, $limit: Int, $offset: Int) {
        searchSpotify(query:$query, market:$market, limit:$limit, offset:$offset) {
            albums {
                href
                limit
                next
                offset
                previous
                total
                items {
                    id
                }
            }
            artists {
                href
                limit
                next
                offset
                previous
                total
                items {
                    id
                }
            }
            tracks {
                href
                limit
                next
                offset
                previous
                total
                items {
                    id
                }
            }
        }
    }
`;

const runSearch1 = async ({ evaluation, test }) => {
    try {
        const response = await runQuery({
            query: SEARCH_SPOTIFY,
            variables: {
                query: "System of a down",
                market: "CH",
            },
            token: "Bad token",
        });
        const searchData = response?.data?.data?.searchSpotify;
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (searchData) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "La recherche a retourné des données",
            });
        } else {
            await testPassed({ evaluation, test });
        }
    } catch (error) {
        await testError({
            evaluation,
            test,
            error,
        });
    }
};

const runSearch2 = async ({ evaluation, test }) => {
    const { token } = await createUser();
    try {
        const response = await runQuery({
            query: SEARCH_SPOTIFY,
            variables: {
                query: "System of a down",
                market: "CH",
            },
            token,
        });
        const searchData = response?.data?.data?.searchSpotify;
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (!searchData?.albums) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "La recherche n'a pas retourné d'albums",
            });
        } else if (!searchData.artists) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "La recherche n'a pas retourné d'artistes",
            });
        } else if (!searchData.tracks) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "La recherche n'a pas retourné de pistes",
            });
        } else {
            await testPassed({
                evaluation,
                test,
            });
        }
    } catch (error) {
        await testError({
            evaluation,
            test,
            error,
        });
    }
    await deleteUser();
};

export { runSearch1, runSearch2 };
