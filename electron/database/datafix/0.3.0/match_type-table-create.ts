/*
1. Creates the match_type table and inserts match_type data.
2. recreates match table with the new match_type foreign keys to match_type.
 */
export default `
create table match_dg_tmp
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
        constraint match_match_type_id_fk
            references match_type
);

insert into match_dg_tmp(id, match_id, timestamp, player_league, player_rank, player_stars, opp_id, opp_name,
                         opp_platform, opp_platform_id, opp_input_config, opp_league, opp_rank, match_type)
select m.id,
       match_id,
       timestamp,
       player_league,
       player_rank,
       player_stars,
       opp_id,
       opp_name,
       opp_platform,
       opp_platform_id,
       opp_input_config,
       opp_league,
       opp_rank,
       mt.id
from match m
join match_type mt on mt.type = m.match_type
;

drop table match;

alter table match_dg_tmp
    rename to match;
`;
