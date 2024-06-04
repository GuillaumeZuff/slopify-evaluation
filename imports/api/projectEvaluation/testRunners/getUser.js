import {
    createUser,
    deleteUser,
    testError,
    testFailed,
    testPassed,
    runQuery,
} from "./helpers";

const GET_USER = `
    query getUser {
        getUser {
            _id
            profile {
                firstname
                lastname
            }
        }
    }
`;

const runGetUser1 = async ({ evaluation, test }) => {
    const { token, user } = await createUser();
    try {
        const response = await runQuery({
            query: GET_USER,
            token,
        });
        const getUser = response.data?.data?.getUser;
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (!getUser) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "getUser n'a pas retourné l'utilisateur courant",
            });
        } else if (getUser._id !== user._id) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "getUser n'a pas retourné le bon utilisateur",
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
    await deleteUser();
};

const runGetUser2 = async ({ evaluation, test }) => {
    try {
        const response = await runQuery({
            query: GET_USER,
            token: "BadToken",
        });
        const getUser = response.data?.data?.getUser;
        if (response.data?.errors) {
            await testError({
                evaluation,
                test,
                error: response.data.errors[0],
            });
        } else if (getUser) {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "getUser a retourné un utilisateur alors qu'aucun utilisateur n'est connecté",
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
};

export { runGetUser1, runGetUser2 };
