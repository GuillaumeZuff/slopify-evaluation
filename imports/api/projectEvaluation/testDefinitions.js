export const TestIds = {
    GET_USER_1: "getUser1",
    GET_USER_2: "getUser2",
};

export const TestDefinitions = [
    {
        id: TestIds.GET_USER_1,
        label: "getUser retourne le user connecté",
    },
    {
        id: TestIds.GET_USER_2,
        label: "getUser retourne null si aucun user n'est connecté",
    },
];
