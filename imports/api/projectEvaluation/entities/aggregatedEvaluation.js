import _ from "underscore";
import { Mongo } from "meteor/mongo";

const AggregatedEvaluations = new Mongo.Collection("evaluation.aggregations");

export { AggregatedEvaluations };
export default AggregatedEvaluations;
