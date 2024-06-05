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
    createUser2,
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
                entityId
                entityType
                grade
                comment
            }
    }
`;

const DELETE_EVALUATION = `
    mutation deleteEvaluation($evaluationId:ID!) {
        deleteEvaluation(evaluationId:$evaluationId) {
            _id
        }
    }
`;

const runDeleteEvaluation1 = async ({ evaluation, test }) => {
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
        const createdEvaluation = response?.data?.data?.createEvaluation;
        const deleteRes = await runQuery({
            query: DELETE_EVALUATION,
            variables: {
                evaluationId: createdEvaluation?._id,
            },
            token,
        });
        const deletedEvaluation = await Evaluations.findOneAsync({
            _id: createdEvaluation?._id,
        });
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (deleteRes.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (!createdEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation n'a pas retourné l'évaluation",
            });
        } else if (!_.some([!deletedEvaluation, deletedEvaluation?.deleted])) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "L'évaluation n'a pas été supprimée",
            });
        } else if (!deleteRes.data?.data?.deleteEvaluation) {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "deleteEvaluation n'a pas retourné l'évaluation supprimée",
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

const runDeleteEvaluation2 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        const { token: token2 } = await createUser2();
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
        const createdEvaluation = response?.data?.data?.createEvaluation;
        const deleteRes = await runQuery({
            query: DELETE_EVALUATION,
            variables: {
                evaluationId: createdEvaluation?._id,
            },
            token: token2,
        });
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (!deleteRes.data?.errors) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "deleteEvaluation n'a pas levé une exception",
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

export { runDeleteEvaluation1, runDeleteEvaluation2 };
