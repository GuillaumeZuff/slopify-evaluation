import ProjectEvaluations from "./entities/projectEvaluation";
import { TestDefinitions, TestIds } from "./testDefinitions";
import { EvaluationStatus } from "../constants";
import { runGetUser1, runGetUser2 } from "./testRunners/getUser";
import { runSetProfile1, runSetProfile2 } from "./testRunners/setProfile";
import { runSearch1, runSearch2 } from "./testRunners/search";
import {
    runCreateEvaluation1,
    runCreateEvaluation2,
    runCreateEvaluation3,
} from "./testRunners/createEvaluation";
import {
    runMyEvaluation1,
    runMyEvaluation2,
    runMyEvaluation3,
} from "./testRunners/myEvaluation";
import { runUpdateEvaluation1 } from "./testRunners/updateEvaluation";
import {
    runMyEvaluations1,
    runMyEvaluations2,
} from "./testRunners/myEvaluations";
import { runAggregatedEvaluation1 } from "./testRunners/aggregatedEvaluation";
import {
    runAllMyEvaluations1,
    runAllMyEvaluations2,
} from "./testRunners/allMyEvaluations";
import {
    runDeleteEvaluation1,
    runDeleteEvaluation2,
} from "./testRunners/deleteEvaluation";

const runProjectEvaluationTest = async ({ evaluation }) => {
    const currentTest = TestDefinitions[evaluation.testIndex];
    if (!currentTest) {
        await ProjectEvaluations.updateAsync(
            {
                _id: evaluation._id,
            },
            {
                $set: {
                    status: EvaluationStatus.DONE,
                },
            },
        );
        return;
    }
    const runnerProps = {
        evaluation,
        test: currentTest,
    };
    switch (currentTest.id) {
        case TestIds.GET_USER_1: {
            await runGetUser1(runnerProps);
            break;
        }
        case TestIds.GET_USER_2: {
            await runGetUser2(runnerProps);
            break;
        }
        case TestIds.SET_PROFILE_1: {
            await runSetProfile1(runnerProps);
            break;
        }
        case TestIds.SET_PROFILE_2: {
            await runSetProfile2(runnerProps);
            break;
        }
        case TestIds.SEARCH_1: {
            await runSearch1(runnerProps);
            break;
        }
        case TestIds.SEARCH_2: {
            await runSearch2(runnerProps);
            break;
        }
        case TestIds.CREATE_EVALUATION_1: {
            await runCreateEvaluation1(runnerProps);
            break;
        }
        case TestIds.CREATE_EVALUATION_2: {
            await runCreateEvaluation2(runnerProps);
            break;
        }
        case TestIds.CREATE_EVALUATION_3: {
            await runCreateEvaluation3(runnerProps);
            break;
        }
        case TestIds.DELETE_EVALUATION_1: {
            await runDeleteEvaluation1(runnerProps);
            break;
        }
        case TestIds.DELETE_EVALUATION_2: {
            await runDeleteEvaluation2(runnerProps);
            break;
        }
        case TestIds.MY_EVALUATION_1: {
            await runMyEvaluation1(runnerProps);
            break;
        }
        case TestIds.MY_EVALUATION_2: {
            await runMyEvaluation2(runnerProps);
            break;
        }
        case TestIds.MY_EVALUATION_3: {
            await runMyEvaluation3(runnerProps);
            break;
        }
        case TestIds.MY_EVALUATIONS_1: {
            await runMyEvaluations1(runnerProps);
            break;
        }
        case TestIds.MY_EVALUATIONS_2: {
            await runMyEvaluations2(runnerProps);
            break;
        }
        case TestIds.ALL_MY_EVALUATIONS_1: {
            await runAllMyEvaluations1(runnerProps);
            break;
        }
        case TestIds.ALL_MY_EVALUATIONS_2: {
            await runAllMyEvaluations2(runnerProps);
            break;
        }
        case TestIds.AGGREGATED_EVALUATION_1: {
            await runAggregatedEvaluation1(runnerProps);
            break;
        }
        case TestIds.UPDATE_EVALUATION_1: {
            await runUpdateEvaluation1(runnerProps);
            break;
        }
    }
};

export { runProjectEvaluationTest };
