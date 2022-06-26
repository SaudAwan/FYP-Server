const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.port;
const sequelize = require("./config/sequelize");
const JobManager = require("./scheduler");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const db = {
  companies: sequelize.import("./models/companies"),
  company_users: sequelize.import("./models/company_users"),
  users: sequelize.import("./models/users"),
  event_categories: sequelize.import("./models/event_categories"),
  sponsors: sequelize.import("./models/sponsors"),
  sponsor_types: sequelize.import("./models/sponsor_types"),
  events: sequelize.import("./models/events"),
  teams: sequelize.import("./models/teams"),
  event_sponsors: sequelize.import("./models/event_sponsors"),
  assosciations: sequelize.import("./models/assosciations"),
  event_assosciations: sequelize.import("./models/event_assosciations"),
  vendors: sequelize.import("./models/vendors"),
  event_vendors: sequelize.import("./models/event_vendors"),
  event_tickets: sequelize.import("./models/event_tickets"),
  event_inventory: sequelize.import("./models/event_inventory"),
  delegates: sequelize.import("./models/delegates"),
  event_delegates: sequelize.import("./models/event_delegates"),
  delegate_categories: sequelize.import("./models/delegate_categories"),
  team_roles: sequelize.import("./models/team_roles"),
  team_users: sequelize.import("./models/team_users"),
  speakers: sequelize.import("./models/speakers"),
  event_speakers: sequelize.import("./models/event_speakers"),
  partners: sequelize.import("./models/partners"),
  event_media_partners: sequelize.import("./models/event_media_partners"),
  venues: sequelize.import("./models/venues"),
  event_venues: sequelize.import("./models/event_venues"),
  agendas: sequelize.import("./models/agendas"),
  agenda_session_days: sequelize.import("./models/agenda_session_days"),
  agenda_sessions: sequelize.import("./models/agenda_sessions"),
  tasks: sequelize.import("./models/tasks"),
  task_comments: sequelize.import("./models/task_comments"),
  emails: sequelize.import("./models/emails"),
  event_bookings: sequelize.import("./models/event_bookings"),
  jobs: sequelize.import("./models/job"),
  rewards: sequelize.import("./models/rewards"),
  rewardsHistory: sequelize.import("./models/rewardsHistory"),
  emailAddresses: sequelize.import("./models/email_addresses"),
};
Object.keys(db).forEach((model) => {
  if ("associate" in db[model]) {
    db[model].associate(db);
  }
});

sequelize
  .sync({
    force: true,
  })
  .then(() => {
    app.use(require("./routes/user")(db));
    app.use(require("./routes/team")(db));
    app.use(require("./routes/event")(db));
    app.use(require("./routes/speaker")(db));
    app.use(require("./routes/partner")(db));
    app.use(require("./routes/agenda")(db));
    app.use(require("./routes/task")(db));
    app.use(require("./routes/templateFactory")(db));
    app.use(require("./routes/email")(db));
    app.use(require("./routes/rewards")(db));
    app.use(require("./routes/companies")(db));
    db.users.bulkCreate(require("./seed/userSeed"));
    db.companies.bulkCreate(require("./seed/companySeed"));
    db.event_categories.bulkCreate(require("./seed/eventCategoriesSeed"));
    db.team_roles.bulkCreate(require("./seed/teamRolesSeed"));
    db.company_users.bulkCreate(require("./seed/company_users"));
    db.teams.bulkCreate(require("./seed/teamSeed"));
    db.team_users.bulkCreate(require("./seed/teamUserSeed"));
    db.events.bulkCreate(require("./seed/eventSeed"));
    db.speakers.bulkCreate(require("./seed/speakerSeed"));
    db.agendas.bulkCreate(require("./seed/agendaSeed"));
    db.tasks.bulkCreate(require("./seed/taskSeed"));
    db.emails.bulkCreate(require("./seed/emailsSeed"));
    db.event_bookings.bulkCreate(require("./seed/eventBookingsSeed"));
    db.jobs.bulkCreate(require("./seed/jobSeed"));
    db.rewards.bulkCreate(require("./seed/rewardsSeed")),
      db.rewardsHistory.bulkCreate(require("./seed/rewardsHistorySeed")),
      db.emailAddresses.bulkCreate(require("./seed/emailAddressesSeed"));

    app.listen(port, async () => {
      JobManager.executeJobs(db, sequelize);
      console.log(`Server listening on port: ${port}`);

      console.log("=================================================");
      password_hash = await bcrypt.hash("321Developer", 8);
      console.log(password_hash);
      console.log("=================================================");
    });
  })
  .catch((e) => console.log(e));
