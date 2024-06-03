export const TestIds = {
    GET_USER_1: "getUser1",
    GET_USER_2: "getUser2",
    SET_PROFILE_1: "setProfile1",
    SET_PROFILE_2: "setProfile2",
    SEARCH_1: "search1",
    SEARCH_2: "search2",
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
    {
        id: TestIds.SET_PROFILE_1,
        label: "setProfile modifie le prénom et le nom du user connecté",
    },
    {
        id: TestIds.SET_PROFILE_2,
        label: "setProfile retourne le user connecté avec le prénom et le nom modifiés",
    },
    {
        id: TestIds.SEARCH_1,
        label: "search retourne null si aucun user n'est connecté",
    },
    {
        id: TestIds.SEARCH_2,
        label: "search retourne des données Spotify",
    },
];
