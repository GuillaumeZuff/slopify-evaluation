import _ from "underscore";
import { SpotifyItemTypes, spotifyAlbums } from "../spotifyData";
import {
    clearEvaluations,
    createUser,
    deleteUser,
    testError,
    testFailed,
    testPassed,
    runQuery,
} from "./helpers";

const CREATE_EVALUATION = `
    mutation createEvaluation($entityId:ID!, $entityType:ID!, $grade:Int!, $comment:String) {
        createEvaluation(
            entityId: $entityId
            entityType: $entityType
            grade: $grade
            comment: $comment
            ) {
                _id
            }
    }
`;

const MY_EVALUATION = `
    query myEvaluation($entityId:ID!, $entityType:ID!) {
        myEvaluation(
            entityId: $entityId
            entityType: $entityType
            ) {
                _id
                entityId
                entityType
                grade
                comment
            }
    }
`;

const runMyEvaluation1 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        const response = await runQuery({
            query: MY_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
            },
            token,
        });
        const slopifyEvaluation = response?.data?.data?.myEvaluation;
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (!slopifyEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "myEvaluation n'a pas retourné l'évaluation",
            });
        } else if (
            !_.every([
                slopifyEvaluation.entityId === spotifyAlbums[0],
                slopifyEvaluation.entityType === SpotifyItemTypes.ALBUM,
            ])
        ) {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "myEvaluation n'a pas retourné les bonnes références à l'entité Spotify",
            });
        } else if (slopifyEvaluation.grade !== 5) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "myEvaluation n'a pas retourné la bonne note",
            });
        } else if (slopifyEvaluation.comment !== "Test comment") {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "myEvaluation n'a pas retourné le bon commentaire",
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
    await clearEvaluations();
    await deleteUser();
};

const runMyEvaluation2 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        const response = await runQuery({
            query: MY_EVALUATION,
            variables: {
                entityId: spotifyAlbums[1],
                entityType: SpotifyItemTypes.ALBUM,
            },
            token,
        });
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (response.data?.data?.myEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation a retourné une évaluation",
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
    await clearEvaluations();
    await deleteUser();
};

const runMyEvaluation3 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        const response = await runQuery({
            query: MY_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
            },
            token: "Bad token",
        });
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (response.data?.data?.myEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation a retourné une évaluation",
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
    await clearEvaluations();
    await deleteUser();
};

export { runMyEvaluation1, runMyEvaluation2, runMyEvaluation3 };
