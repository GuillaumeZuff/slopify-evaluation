import {
    createUser,
    deleteUser,
    testFailed,
    testPassed,
    GRAPHQL_END_POINT,
} from "./helpers";
import axios from "axios";

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
        const response = await axios.post(
            GRAPHQL_END_POINT,
            {
                query: GET_USER,
            },
            {
                headers: {
                    authorization: token,
                },
            },
        );
        const getUser = response.data?.data?.getUser;
        if (!getUser) {
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
        await testFailed({
            evaluation,
            test,
            errorMessage: "getUser a retourné une erreur",
        });
    }
    await deleteUser();
};

const runGetUser2 = async ({ evaluation, test }) => {
    try {
        const response = await axios.post(
            GRAPHQL_END_POINT,
            {
                query: GET_USER,
            },
            {
                headers: {
                    authorization: "BadToken",
                },
            },
        );
        const getUser = response.data?.data?.getUser;
        if (getUser) {
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
        await testFailed({
            evaluation,
            test,
            errorMessage: "getUser a retourné une erreur",
        });
    }
};

export { runGetUser1, runGetUser2 };
