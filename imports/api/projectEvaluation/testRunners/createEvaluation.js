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
                entityId
                entityType
                grade
                comment
            }
    }
`;

const runCreateEvaluation1 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        const response = await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        const slopifyEvaluation = response?.data?.data?.createEvaluation;
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
                errorMessage: "createEvaluation n'a pas retourné l'évaluation",
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
                    "createEvaluation n'a pas retourné les bonnes références à l'entité Spotify",
            });
        } else if (slopifyEvaluation.grade !== 5) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation n'a pas retourné la bonne note",
            });
        } else if (slopifyEvaluation.comment !== "Test comment") {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "createEvaluation n'a pas retourné le bon commentaire",
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

const runCreateEvaluation2 = async ({ evaluation, test }) => {
    try {
        const response = await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token: "Bad token",
        });
        if (response.data?.errors) {
            await testPassed({
                evaluation,
                test,
            });
        } else {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation n'a pas retourné d'erreur",
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
};

const runCreateEvaluation3 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        const firstResponse = await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        if (!firstResponse.data?.data?.createEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "createEvaluation n'a pas créé ou retourné l'évaluation",
            });
        }
        const response = await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        if (response.data?.errors) {
            await testPassed({
                evaluation,
                test,
            });
        } else {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation n'a pas retourné d'erreur",
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

export { runCreateEvaluation1, runCreateEvaluation2, runCreateEvaluation3 };
