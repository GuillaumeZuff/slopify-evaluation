export const TestIds = {
    GET_USER_1: "getUser1",
    GET_USER_2: "getUser2",
    SET_PROFILE_1: "setProfile1",
    SET_PROFILE_2: "setProfile2",
    SEARCH_1: "search1",
    SEARCH_2: "search2",
    CREATE_EVALUATION_1: "createEvaluation1",
    CREATE_EVALUATION_2: "createEvaluation2",
    CREATE_EVALUATION_3: "createEvaluation3",
    MY_EVALUATION_1: "myEvaluation1",
    MY_EVALUATION_2: "myEvaluation2",
    MY_EVALUATION_3: "myEvaluation3",
    UPDATE_EVALUATION_1: "updateEvaluation1",
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
        id: TestIds.CREATE_EVALUATION_1,
        label: "createEvaluation crée une évaluation",
    },
    {
        id: TestIds.CREATE_EVALUATION_2,
        label: "createEvaluation lève une exception si aucun user n'est connecté",
    },
    {
        id: TestIds.CREATE_EVALUATION_3,
        label: "createEvaluation lève une exception si le user connecté a déjà évalué l'élément Spotify",
    },
    {
        id: TestIds.MY_EVALUATION_1,
        label: "myEvaluation retourne l'évaluation demandée par le user connecté",
    },
    {
        id: TestIds.MY_EVALUATION_2,
        label: "myEvaluation retourne null si l'évaluation demandée n'existe pas",
    },
    {
        id: TestIds.MY_EVALUATION_3,
        label: "myEvaluation retourne null si aucun user n'est connecté",
    },
    {
        id: TestIds.UPDATE_EVALUATION_1,
        label: "updateEvaluation modifie une évaluation",
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
