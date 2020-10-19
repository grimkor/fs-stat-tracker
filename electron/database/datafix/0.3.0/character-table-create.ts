/*
recreates game table with the new player_character and opp_character now foreign keys to character
 */
export default `
create table game_dg_tmp
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

insert into game_dg_tmp(player_character, player_score, opp_character, opp_score, match_id)
select c.id, player_score, c2.id, opp_score, match_id
from game tg
         join character c on c.name = tg.player_character
         join character c2 on c2.name = tg.opp_character;

drop table game;

alter table game_dg_tmp
    rename to game;
`
