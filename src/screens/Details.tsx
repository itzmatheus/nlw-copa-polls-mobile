import { useCallback, useState } from "react";
import { Share } from 'react-native';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCardProps } from '../components/PollCard';
import { PollHeader } from "../components/PollHeader";
import { EmptyMyPollList } from "../components/EmptyMyPollList";

import { api } from "../services/api";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
    id: string;
}

export function Details() {

    const route = useRoute();
    const { id } = route.params as RouteParams;

    const toast = useToast();

    const [ optionSelected, setOptionSelected ] = useState<'guesses' | 'ranking'>('guesses');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ pollDetails, setPollDetails ] = useState<PollCardProps>({} as PollCardProps);

    async function fetchPollDetails() {

        try {
            setIsLoading(true);
            const responseDetails = await api.get(`/polls/${id}`);
            setPollDetails(responseDetails.data.poll)

        } catch (error) {
            console.log(error);
            toast.show({
                title: 'Não foi possivel carregar os dados do bolão!',
                placement: 'top',
                bgColor: 'red.500',
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: pollDetails.code,
        })
    }

    useFocusEffect(useCallback(() => {
        fetchPollDetails();
    }, [id]));

    if (isLoading) {
        return <Loading />
    };


    return (
        <VStack flex={1} bgColor="gray.900">
            <Header
                title={pollDetails.title}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />
            {
                pollDetails._count?.participants > 0 ?
                <VStack flex={1}>
                    <PollHeader data={pollDetails} />

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option
                            title="Seu Palpites"
                            isSelected={optionSelected === 'guesses'}
                            onPress={() => setOptionSelected("guesses")}
                        />
                        <Option
                            title="Ranking do Grupo"
                            isSelected={optionSelected ===  'ranking'}
                            onPress={() => setOptionSelected("ranking")}
                        />
                    </HStack>
                    <Guesses
                        pollId={pollDetails.id}
                    />

                </VStack>: <EmptyMyPollList onShare={handleCodeShare} code={pollDetails.code} />
            }
        </VStack>
    );
}