import { Accounts } from "meteor/accounts-base";
import axios from "axios";
import ProjectEvaluations from "../entities/projectEvaluation";
import { TestResults } from "../../constants";
import Evaluations from "../entities/evaluation";
import AggregatedEvaluations from "../entities/aggregatedEvaluation";

const USER_ID = "testUser";
const USER_ID_2 = "testUser2";
const USER_ID_3 = "testUser3";
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

const insertUser = async ({ _id, email, firstname, lastname }) => {
    const stampedToken = Accounts._generateStampedLoginToken();
    const hashStampedToken = Accounts._hashStampedToken(stampedToken);
    await Meteor.users.removeAsync({ _id });
    await Meteor.users.insertAsync({
        _id,
        createdAt: new Date(),
        emails: [
            {
                address: email,
                verified: true,
            },
        ],
        profile: {
            firstname,
            lastname,
            locale: "fr",
        },
        services: {
            resume: {
                loginTokens: [hashStampedToken],
            },
        },
    });
    const user = await Meteor.users.findOneAsync({ _id });
    return {
        token: stampedToken.token,
        user,
    };
};

const createUser = async () => {
    return await insertUser({
        _id: USER_ID,
        firstname: "Test1",
        lastname: "User1",
        email: "testuser1@slopify.com",
    });
};

const createUser2 = async () => {
    return await insertUser({
        _id: USER_ID_2,
        firstname: "Test2",
        lastname: "User2",
        email: "testuser2@slopify.com",
    });
};

const createUser3 = async () => {
    return await insertUser({
        _id: USER_ID_3,
        firstname: "Test3",
        lastname: "User3",
        email: "testuser3@slopify.com",
    });
};

const deleteUser = async () => {
    Meteor.users.remove({
        _id: { $in: [USER_ID, USER_ID_2, USER_ID_3] },
    });
};

const clearEvaluations = async () => {
    Evaluations.remove({});
    AggregatedEvaluations.remove({});
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
    createUser2,
    createUser3,
    deleteUser,
    runQuery,
    testError,
    testFailed,
    testPassed,
    GRAPHQL_END_POINT,
    USER_ID,
};
