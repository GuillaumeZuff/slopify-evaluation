import ProjectEvaluations from "./entities/projectEvaluation";
import { TestDefinitions, TestIds } from "./testDefinitions";
import { EvaluationStatus } from "../constants";
import { runGetUser1, runGetUser2 } from "./testRunners/getUser";
import { runSetProfile1, runSetProfile2 } from "./testRunners/setProfile";
import { runSearch1, runSearch2 } from "./testRunners/search";

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
    }
};

export { runProjectEvaluationTest };
