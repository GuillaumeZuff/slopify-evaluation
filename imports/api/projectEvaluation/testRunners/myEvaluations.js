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

const MY_EVALUATIONS = `
    query myEvaluations($entityIds:[ID]!, $entityType:ID!) {
        myEvaluations(
            entityIds: $entityIds
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

const runMyEvaluations1 = async ({ evaluation, test }) => {
    const COUNT = 5;
    await clearEvaluations();
    try {
        const { token, user } = await createUser();
        for (let i = 0; i < COUNT; i++) {
            await runQuery({
                query: CREATE_EVALUATION,
                variables: {
                    entityId: spotifyAlbums[i],
                    entityType: SpotifyItemTypes.ALBUM,
                    grade: Math.round(i / 2),
                    comment: `Test_${i + 1}`,
                },
                token,
            });
        }
        const evaluations = await Evaluations.find({
            userId: user._id,
        }).fetchAsync();
        const response = await runQuery({
            query: MY_EVALUATIONS,
            variables: {
                entityIds: _.first(spotifyAlbums, COUNT),
                entityType: SpotifyItemTypes.ALBUM,
            },
            token,
        });
        const slopifyEvaluations = response?.data?.data?.myEvaluations;
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (evaluations?.length !== COUNT) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation n'a pas créé les évaluations",
            });
        } else if (slopifyEvaluations?.length !== COUNT) {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "myEvaluations n'a pas retourné toutes les évaluations",
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

const runMyEvaluations2 = async ({ evaluation, test }) => {
    const COUNT = 5;
    await clearEvaluations();
    try {
        const { token, user } = await createUser();
        for (let i = 0; i < COUNT; i++) {
            await runQuery({
                query: CREATE_EVALUATION,
                variables: {
                    entityId: spotifyAlbums[i],
                    entityType: SpotifyItemTypes.ALBUM,
                    grade: Math.round(i / 2),
                    comment: `Test_${i + 1}`,
                },
                token,
            });
        }
        const evaluations = await Evaluations.find({
            userId: user._id,
        }).fetchAsync();
        const response = await runQuery({
            query: MY_EVALUATIONS,
            variables: {
                entityIds: _.first(spotifyAlbums, COUNT),
                entityType: SpotifyItemTypes.ALBUM,
            },
            token: "NotConnected",
        });
        const slopifyEvaluations = response?.data?.data?.myEvaluations;
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (evaluations?.length !== COUNT) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "createEvaluation n'a pas créé les évaluations",
            });
        } else if (slopifyEvaluations !== null) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "myEvaluations n'a pas retourné null",
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

export { runMyEvaluations1, runMyEvaluations2 };
