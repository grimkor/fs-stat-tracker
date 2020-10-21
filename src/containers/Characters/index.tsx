import React, {FC, useContext} from "react";
import CharacterContainer from "../../components/CharacterContainer";
import CharacterCard from "../../components/CharacterCard";
import {AppContext} from "../../context";
import {useIpcRequest} from "../../helpers/useIpcRequest";
import {CharacterOverview} from "../../../electron/types";

const Characters: FC = () => {
  const {filter} = useContext(AppContext);
  const {data} = useIpcRequest<CharacterOverview[]>(
    "get_character_overview",
    filter
  );
  return (
    <CharacterContainer>
      {data?.map(({name, wins, losses}) => (
        <CharacterCard
          key={name}
          character={name}
          wins={wins}
          losses={losses}
        />
      ))}
    </CharacterContainer>
  );
};

export default Characters;
