CREATE TABLE IF NOT EXISTS teams (
    id serial primary key,
    name VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS players (
    id serial primary key,
    first_name VARCHAR(16),
    last_name VARCHAR(28),
    number tinyint,
    -- pg, sg, sf, pw, c
    position VARCHAR(2),
    team_id bigint unsigned,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS games (
    id serial primary key,
    team_one_score int unsigned,
    team_two_score int unsigned,
    team_one_id bigint unsigned,
    team_two_id bigint unsigned,
    is_ended boolean,
    created_at datetime,
    updated_at datetime,
    FOREIGN KEY (team_one_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (team_two_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    -- telegram id
    id VARCHAR(16) primary key
);

CREATE TABLE IF NOT EXISTS users_subscriptions_games (
    id serial primary key,
    user_id VARCHAR(16),
    game_id bigint unsigned,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users_subscriptions_teams (
    id serial primary key,
    user_id VARCHAR(16),
    team_id bigint unsigned,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);