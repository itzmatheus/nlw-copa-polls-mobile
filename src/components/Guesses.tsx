import { useFocusEffect } from '@react-navigation/native';
import { Box, FlatList, useToast } from 'native-base';
import { useCallback, useState } from 'react';

import { api } from '../services/api';

import { GameProps, Game } from '../components/Game';
import { Loading } from './Loading';
import { EmptyMyPollList } from './EmptyMyPollList';
import { Share } from 'react-native';

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {

  const toast = useToast();

  const [ isLoading, setIsLoading ] = useState(true);
  const [ games, setGames ] = useState<GameProps[]>([]);
  const [ firstTeamPoints, setFirstTeamPoints ] = useState('');
  const [ secondTeamPoints, setSecondTeamPoints ] = useState('');

  async function fetchGames() {
    try {
      setIsLoading(true);
      const responseGames = await api.get(`/polls/${pollId}/games`)
      setGames(responseGames.data.games)

    } catch (error) {
      console.log(error);
      toast.show({
          title: 'Não foi possivel carregar os jogos!',
          placement: 'top',
          bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do jogo!',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: 'Palpite realizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });

      fetchGames();
    } catch (error) {
      console.log(error.data);
      toast.show({
          title: 'Não foi possível confirmar o palpite!',
          placement: 'top',
          bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
        message: code,
    })
}

  useFocusEffect(useCallback(() => {
    fetchGames();
  }, [pollId]));

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box>
        <FlatList
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Game
              data={item}
              setFirstTeamPoints={setFirstTeamPoints}
              setSecondTeamPoints={setSecondTeamPoints}
              onGuessConfirm={() => handleGuessConfirm(item.id)}
            /> 
          )}
          ListEmptyComponent={() => (
            <EmptyMyPollList code={code} onShare={handleCodeShare} />
          )}
          _contentContainerStyle={{ pb: 50 }}
          />
    </Box>
  );
}
