import { Accounts } from "meteor/accounts-base";
import axios from "axios";
import ProjectEvaluations from "../entities/projectEvaluation";
import { TestResults } from "../../constants";
import Evaluations from "../entities/evaluation";

const USER_ID = "testUser";
const GRAPHQL_END_POINT = "http://localhost:3000/graphql";

const removeTestResult = async ({ evaluation, test }) => {
    await ProjectEvaluations.updateAsync(
        {
            _id: evaluation._id,
        },
        {
            $pull: {
                testResults: {
                    testId: test.id,
                },
            },
        },
    );
};

const testError = async ({ evaluation, test, error }) => {
    await removeTestResult({ evaluation, test });
    await ProjectEvaluations.updateAsync(
        {
            _id: evaluation._id,
        },
        {
            $push: {
                testResults: {
                    testId: test.id,
                    result: TestResults.FAILED,
                    errorMessage: `Une erreur est survenue lors de l'exécution du test: ${error?.message}`,
                },
            },
            $inc: {
                testIndex: 1,
            },
        },
    );
};

const testFailed = async ({ evaluation, test, errorMessage }) => {
    await removeTestResult({ evaluation, test });
    await ProjectEvaluations.updateAsync(
        {
            _id: evaluation._id,
        },
        {
            $push: {
                testResults: {
                    testId: test.id,
                    result: TestResults.FAILED,
                    errorMessage,
                },
            },
            $inc: {
                testIndex: 1,
            },
        },
    );
};

const testPassed = async ({ evaluation, test }) => {
    await removeTestResult({ evaluation, test });
    await ProjectEvaluations.updateAsync(
        {
            _id: evaluation._id,
        },
        {
            $push: {
                testResults: {
                    testId: test.id,
                    result: TestResults.PASSED,
                },
            },
            $inc: {
                testIndex: 1,
            },
        },
    );
};

const createUser = async () => {
    const stampedToken = Accounts._generateStampedLoginToken();
    const hashStampedToken = Accounts._hashStampedToken(stampedToken);
    //console.log("token", stampedToken.token);
    //console.log("hashedToken", hashStampedToken.hashedToken);
    Meteor.users.upsert(
        {
            _id: USER_ID,
        },
        {
            $setOnInsert: {
                _id: USER_ID,
                createdAt: new Date(),
                emails: [
                    {
                        address: "testuser@slopify.com",
                        verified: true,
                    },
                ],
                profile: {
                    firstname: "Test",
                    lastname: "User",
                    locale: "fr",
                },
            },
            $set: {
                services: {
                    resume: {
                        loginTokens: [hashStampedToken],
                    },
                },
            },
        },
    );
    const user = await Meteor.users.findOneAsync({ _id: USER_ID });
    return {
        token: stampedToken.token,
        user,
    };
};

const deleteUser = async () => {
    Meteor.users.remove({
        _id: USER_ID,
    });
};

const clearEvaluations = async () => {
    Evaluations.remove({});
};

const runQuery = async ({ query, variables, token }) => {
    return await axios.post(
        GRAPHQL_END_POINT,
        {
            query,
            variables,
        },
        {
            headers: {
                authorization: token,
            },
        },
    );
};

export {
    clearEvaluations,
    createUser,
    deleteUser,
    runQuery,
    testError,
    testFailed,
    testPassed,
    GRAPHQL_END_POINT,
    USER_ID,
};
