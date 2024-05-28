import "meteor/aldeed:collection2/static";
import { Meteor } from "meteor/meteor";
import { startApolloServer } from "../imports/api/apollo/server";

Meteor.startup(() => {
  startApolloServer();
});
