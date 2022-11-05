import { Heading, useToast, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";

export function Find() {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ code, setCode ] = useState('');

    const toast = useToast();
    const { navigate } = useNavigation();

    async function handleJoinPoll() {
        try {
            setIsLoading(true)

            if (!code.trim()) {
                setIsLoading(false)
                return toast.show({
                    title: 'Informe o código',
                    placement: 'top',
                    bgColor: 'red.500',
                })
            }

            await api.post('/polls/join', { code });
            setIsLoading(false)
            setCode('')
            toast.show({
                title: 'Você já está participando do bolão!',
                placement: 'top',
                bgColor: 'green.500',
            })
            navigate('polls');

        } catch (error) {
            console.log(error)
            setIsLoading(false)

            if (error.response?.data?.message) {
                return toast.show({
                    title: error.response.data.message,
                    placement: 'top',
                    bgColor: 'red.500',
                })
            } else {
                return toast.show({
                    title: "Erro ao buscar bolão!",
                    placement: 'top',
                    bgColor: 'red.500',
                })
            }
        }
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre um bolão através de {'\n'} seu código único
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                    value={code}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    onPress={handleJoinPoll}
                    isLoading={isLoading}
                />

            </VStack>
        </VStack>
    );
}