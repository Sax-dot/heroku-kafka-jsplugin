'use strict';

let cli = require('heroku-cli-util');
let co = require('co');
let HerokuKafkaClusters = require('./clusters.js').HerokuKafkaClusters;
let columnify = require('columnify');
let _ = require('underscore');

function* kafkaTopic (context, heroku) {
  var topic = yield new HerokuKafkaClusters(heroku, process.env, context).topic(context.args.CLUSTER, context.args.TOPIC);
  if (topic) {
    var info = _.map(topic.info, function (entry) {
      return {
        name: entry.name + ':',
        value: entry.values.join("\n")
      };
    });
    console.log('=== ' + (topic.attachment_name || 'HEROKU_KAFKA') + ' :: ' + topic.topic);
    console.log(columnify(info, {showHeaders: false, preserveNewLines: true}));
    console.log();
  } else {
    process.exit(1);
  }
}

module.exports = {
  topic: 'kafka',
  command: 'topic',
  description: 'shows information about a topic in your Heroku kafka cluster',
  args: [
    {
      name: 'TOPIC',
      optional: false
    },
    {
      name: 'CLUSTER',
      optional: true
    }
  ],
  help: `
    Shows information about a topic in your kafka cluster

    Examples:

    $ heroku kafka:info page-visits
    $ heroku kafka:info page-visits kafka-adjacent-1337
`,
  needsApp: true,
  needsAuth: true,
  run: cli.command(co.wrap(kafkaTopic))
};
