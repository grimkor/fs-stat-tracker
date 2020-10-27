import React, { FC } from "react";
import CharacterContainer from "../../components/CharacterContainer";
import CharacterCard from "../../components/CharacterCard";
import { CharactersList } from "../../types";

const Characters: FC = () => {
  return (
    <CharacterContainer>
      {CharactersList.map((name) => (
        <CharacterCard key={name} character={name} />
      ))}
    </CharacterContainer>
  );
};

export default Characters;
