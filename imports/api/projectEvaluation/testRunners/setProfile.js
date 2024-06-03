import {
    createUser,
    deleteUser,
    testError,
    testFailed,
    testPassed,
    runQuery,
} from "./helpers";

const SET_PROFILE = `
    mutation setProfile($firstname: String!, $lastname: String!) {
        setProfile(firstname:$firstname, lastname:$lastname) {
            _id
            profile {
                firstname
                lastname
            }
        }
    }
`;

const runSetProfile1 = async ({ evaluation, test }) => {
    const { token, user } = await createUser();
    try {
        const response = await runQuery({
            query: SET_PROFILE,
            variables: {
                firstname: "Test_updated",
                lastname: "User_updated",
            },
            token,
        });
        const mutationUser = response.data?.data?.setProfile;
        const updatedUser = Meteor.users.findOne({
            _id: user._id,
        });
        if (!mutationUser) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "setProfile n'a pas retourné le user connecté",
            });
        } else if (updatedUser.profile?.firstname !== "Test_updated") {
            await testFailed({
                evaluation,
                test,
                errorMessage:
                    "setProfile n'a pas modifié le prénom ou a retourné l'ancien nom",
            });
        } else if (updatedUser.profile?.lastname !== "User_updated") {
            await testFailed({
                evaluation,
                test,
                errorMessage: "setProfile n'a pas modifié le nom",
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

const runSetProfile2 = async ({ evaluation, test }) => {
    const { token } = await createUser();
    try {
        const response = await runQuery({
            query: SET_PROFILE,
            variables: {
                firstname: "Test_updated_2",
                lastname: "User_updated_2",
            },
            token,
        });
        const mutationUser = response.data?.data?.setProfile;
        if (!mutationUser) {
            await testFailed({
                evaluation,
                test,
                errorMessage: "setProfile n'a pas retourné le user connecté",
            });
        } else if (mutationUser.profile?.firstname !== "Test_updated_2") {
            await testFailed({
                evaluation,
                test,
                errorMessage: "setProfile n'a pas retourné le nouveau prénom",
            });
        } else if (mutationUser.profile?.lastname !== "User_updated_2") {
            await testFailed({
                evaluation,
                test,
                errorMessage: "setProfile n'a pas retourné le nouveau nom",
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

export { runSetProfile1, runSetProfile2 };
