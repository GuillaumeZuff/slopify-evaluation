import { ProjectEvaluations } from "../entities/projectEvaluation";

const studentEvaluations = async (obj, args) => {
  const { studentId } = args;
  return ProjectEvaluations.find(
    {
      studentIds: studentId,
    },
    { sort: [["createdAt", "desc"]] },
  ).fetch();
};

const createProjectEvaluation = async (obj, args) => {
  console.log("createProjectEvaluation", args);
  const { studentIds } = args;
  const evaluationId = ProjectEvaluations.insert({
    createdAt: new Date(),
    deleted: false,
    studentIds,
  });
  return ProjectEvaluations.findOne({
    _id: evaluationId,
  });
};

export { studentEvaluations, createProjectEvaluation };
