import _ from "underscore";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "meteor/aldeed:simple-schema";

const ProjectEvaluations = new Mongo.Collection("project.evaluations");

ProjectEvaluations.attachSchema(
  new SimpleSchema({
    createdAt: Date,
    deleted: Boolean,
    deletedAt: {
      type: Date,
      optional: true,
    },
    studentIds: Array,
    "studentIds.$": String,
  }),
);

export { ProjectEvaluations };
export default ProjectEvaluations;
