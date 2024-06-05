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
    createUser3,
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
            }
    }
`;

const AGGREGATED_EVALUATION = `
    query aggregatedEvaluation($entityId:ID!, $entityType:ID!) {
        aggregatedEvaluation(
            entityId: $entityId
            entityType: $entityType
            ) {
                _id
                averageGrade
                entityId
                entityType
                totalGrades
            }
    }
`;

const getRandomGrade = () => {
    return Math.floor(Math.random() * (5 - 1 + 1)) + 1;
};

const createEvaluations = async ({ tokens }) => {
    const count = _.size(tokens);
    const grades = [];
    for (let i = 0; i < count; i++) {
        const grade = getRandomGrade();
        grades.push(grade);
        await runQuery({
            query: CREATE_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
                grade,
            },
            token: tokens[i],
        });
    }
    return grades;
};

const runAggregatedEvaluation1 = async ({ evaluation, test }) => {
    try {
        const { token } = await createUser();
        const { token: token2 } = await createUser2();
        const { token: token3 } = await createUser3();
        const grades = await createEvaluations({
            tokens: [token, token2, token3],
        });
        const response = await runQuery({
            query: AGGREGATED_EVALUATION,
            variables: {
                entityId: spotifyAlbums[0],
                entityType: SpotifyItemTypes.ALBUM,
            },
            token,
        });
        const aggregatedEval = response?.data?.data?.aggregatedEvaluation;
        const expectedAverageGrade =
            _.reduce(grades, (memo, grade) => memo + grade, 0) / _.size(grades);
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (!aggregatedEval) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "aggregatedEvaluation n'a pas retourné de valeur",
            });
        } else if (
            _.every([
                aggregatedEval.averageGrade !== expectedAverageGrade,
                aggregatedEval.averageGrade < expectedAverageGrade - 0.1,
                aggregatedEval.averageGrade > expectedAverageGrade + 0.1,
            ])
        ) {
            await testFailed({
                evaluation,
                test,
                errorMessage: `aggregatedEvaluation n'a pas retourné la moyenne attendue: ${aggregatedEval?.averageGrade}. Valeur attendue: ${expectedAverageGrade}`,
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

export { runAggregatedEvaluation1 };
