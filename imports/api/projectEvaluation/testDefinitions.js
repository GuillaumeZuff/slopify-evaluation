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
    DELETE_EVALUATION_1: "deleteEvaluation1",
    DELETE_EVALUATION_2: "deleteEvaluation2",
    MY_EVALUATION_1: "myEvaluation1",
    MY_EVALUATION_2: "myEvaluation2",
    MY_EVALUATION_3: "myEvaluation3",
    MY_EVALUATIONS_1: "myEvaluations1",
    MY_EVALUATIONS_2: "myEvaluations2",
    ALL_MY_EVALUATIONS_1: "allMyEvaluations1",
    ALL_MY_EVALUATIONS_2: "allMyEvaluations2",
    AGGREGATED_EVALUATION_1: "aggregatedEvaluation",
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
        id: TestIds.DELETE_EVALUATION_1,
        label: "deleteEvaluation supprime une évaluation",
    },
    {
        id: TestIds.DELETE_EVALUATION_2,
        label: "deleteEvaluation lève une exception si un user essaie de supprimer une évaluation qui ne lui appartient pas",
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
        id: TestIds.MY_EVALUATIONS_1,
        label: "myEvaluations retourne des évaluations du user connecté",
    },
    {
        id: TestIds.MY_EVALUATIONS_2,
        label: "myEvaluations retourne null si aucun user n'est connecté",
    },
    {
        id: TestIds.ALL_MY_EVALUATIONS_1,
        label: "allMyEvaluations retourne toutes les évaluations du user connecté",
    },
    {
        id: TestIds.ALL_MY_EVALUATIONS_2,
        label: "allMyEvaluations retourne null si aucun user n'est connecté",
    },
    {
        id: TestIds.AGGREGATED_EVALUATION_1,
        label: "aggregatedEvaluation retourne une évaluation aggrégée avec la moyenne des évaluations",
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
