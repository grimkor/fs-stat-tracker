export const createGameTable = `
create table IF NOT EXISTS game
(
    player_character integer,
    player_score     integer,
    opp_character    integer,
    opp_score        integer,
    match_id         integer
        references match,
    constraint game_pk
        unique (player_character, opp_character, match_id),
    constraint game_character_id_id_fk
        foreign key (player_character, opp_character) references character (id, id)
);
`;

export const createMatchTable = `
create table IF NOT EXISTS match
(
    id               integer not null
        constraint match_pk
            primary key autoincrement,
    match_id         TEXT    not null,
    timestamp        INTEGER default CURRENT_TIMESTAMP,
    player_league    integer,
    player_rank      integer,
    player_stars     integer,
    opp_id           integer,
    opp_name         TEXT,
    opp_platform     TEXT,
    opp_platform_id  integer,
    opp_input_config integer,
    opp_league       integer,
    opp_rank         integer,
    match_type       integer
        references match_type
);
`;

export const createConfigTable = `
create table IF NOT EXISTS config
(
    setting TEXT
        constraint config_pk
            primary key,
    value   TEXT
);

create unique index IF NOT EXISTS config_setting_uindex
    on config (setting);
`;

export const createPlayerTable = `
create table IF NOT EXISTS player
(
    property TEXT not null
        constraint player_pk
            primary key,
    value    TEXT
);

create unique index IF NOT EXISTS player_property_uindex
    on player (property);
`;

export const createCharacterTable = `
create table IF NOT EXISTS character
(
    id   integer not null
        constraint character_pk
            primary key autoincrement,
    name TEXT    not null
);

create unique index IF NOT EXISTS character_id_uindex
    on character (id);

create unique index IF NOT EXISTS character_name_uindex
    on character (name);


INSERT OR IGNORE INTO character (id, name) VALUES (1, 'Grave');
INSERT OR IGNORE INTO character (id, name) VALUES (2, 'Jaina');
INSERT OR IGNORE INTO character (id, name) VALUES (3, 'Argagarg');
INSERT OR IGNORE INTO character (id, name) VALUES (4, 'Geiger');
INSERT OR IGNORE INTO character (id, name) VALUES (5, 'Setsuki');
INSERT OR IGNORE INTO character (id, name) VALUES (6, 'Valerie');
INSERT OR IGNORE INTO character (id, name) VALUES (7, 'Midori');
INSERT OR IGNORE INTO character (id, name) VALUES (8, 'Rook');
INSERT OR IGNORE INTO character (id, name) VALUES (9, 'DeGrey');
INSERT OR IGNORE INTO character (id, name) VALUES (10, 'Lum');
INSERT OR IGNORE INTO character (id, name) VALUES (11, 'Quince');
INSERT OR IGNORE INTO character (id, name) VALUES (12, 'Onimaru');
`;

export const createMatchTypeTable = `
create table IF NOT EXISTS match_type
(
    id   integer not null
        constraint match_type_pk
            primary key autoincrement,
    type TEXT    not null
);

create unique index IF NOT EXISTS match_type_id_uindex
    on match_type (id);

create unique index IF NOT EXISTS match_type_type_uindex
    on match_type (type);

INSERT OR IGNORE INTO match_type (id, type)
VALUES (1, 'casual');
INSERT OR IGNORE INTO match_type (id, type)
VALUES (2, 'ranked');
INSERT OR IGNORE INTO match_type (id, type)
VALUES (3, 'challenge');
`;
