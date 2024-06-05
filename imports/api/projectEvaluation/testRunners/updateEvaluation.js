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
import Evaluations from "../entities/evaluation";

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

const UPDATE_EVALUATION = `
    mutation updateEvaluation($evaluationId:ID!, $grade:Int!, $comment:String) {
        updateEvaluation(
            evaluationId: $evaluationId
            grade: $grade
            comment: $comment
            ) {
                _id
                grade
                comment
            }
    }
`;

const runUpdateEvaluation1 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        const createResponse = await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        const slopifyEvaluation = createResponse?.data?.data?.createEvaluation;
        if (!slopifyEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation n'a pas retourné l'évaluation",
            });
        }
        const response = await runQuery({
            query: UPDATE_EVALUATION,
            variables: {
                evaluationId: slopifyEvaluation._id,
                grade: 2,
                comment: "New comment",
            },
            token,
        });
        const updatedEvaluation = response?.data?.data?.updateEvaluation;
        const dbEvaluation = await Evaluations.findOneAsync({
            _id: slopifyEvaluation?._id,
        });
        if (!updatedEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "updateEvaluation n'a pas retourné l'évaluation",
            });
        } else if (updatedEvaluation.grade !== 2) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "updateEvaluation n'a pas retourné la bonne note",
            });
        } else if (updatedEvaluation.comment !== "New comment") {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "updateEvaluation n'a pas retourné le bon commentaire",
            });
        } else if (!dbEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "L'évaluation n'existe pas dans la base de données",
            });
        } else if (dbEvaluation.grade !== 2) {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "La note de l'évaluation n'a pas été mise à jour dans la base de données",
            });
        } else if (dbEvaluation.comment !== "New comment") {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "Le commentaire de l'évaluation n'a pas été mis à jour dans la base de données",
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

const updateMyEvaluation2 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        const createResponse = await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade: 5,
                comment: "Test comment",
            },
            token,
        });
        const slopifyEvaluation = createResponse?.data?.data?.createEvaluation;
        const response = await runQuery({
            query: UPDATE_EVALUATION,
            variables: {
                evaluationId: slopifyEvaluation._id,
                grade: 2,
                comment: "New comment",
            },
            token,
        });
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
        } else if (!response.data?.errors) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "updateEvaluation n'as pas retourné d'erreur",
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

export { runUpdateEvaluation1, runMyEvaluation2, runMyEvaluation3 };
